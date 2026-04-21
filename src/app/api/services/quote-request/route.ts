import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { checkRateLimitRedis } from '@/lib/rate-limit-redis';
import { createServiceClient } from '@/lib/supabase/service';
import { QuoteSubmissionSchema, validateSubmissionAgainstCatalog } from '@/lib/services/validation';
import { SERVICE_CATALOG, getServiceById } from '@/lib/services/catalog';
import { CATALOG_VERSION } from '@/lib/services/catalog-version.generated';
import { computeGrandTotal, countPendingItems, collectDeliverables, collectThirdPartyCosts, computeMaintenanceForService } from '@/lib/services/pricing';
import { signQuoteId, buildQuoteUrl } from '@/lib/services/quote-url';
import { renderEmail } from '@/emails/render';
import type { SelectedItemSnapshot, Currency, Locale, QuoteSubmission } from '@/lib/services/types';

function hashIp(ip: string): string {
	return crypto.createHash('sha256').update(ip).digest('hex');
}

function formatPrice(amount: number, currency: Currency): string {
	if (currency === 'BRL') return `R$ ${amount.toLocaleString('pt-BR')}`;
	return `USD ${amount.toLocaleString('en-US')}`;
}

function formatDate(date: Date, locale: Locale): string {
	return date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

async function sendDiscordWebhook(payload: object): Promise<void> {
	const url = process.env.DISCORD_QUOTE_WEBHOOK_URL;
	if (!url) return;

	try {
		await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
	} catch (err) {
		console.error('[quote-request] Discord webhook failed:', err);
	}
}

async function sendConfirmationEmail(
	submission: QuoteSubmission,
	shareableUrl: string,
	expirationDate: Date,
	hasPendingItems: boolean,
	pendingItemCount: number
): Promise<void> {
	const brevoApiKey = process.env.BREVO_API_KEY;
	if (!brevoApiKey) {
		console.error('[quote-request] BREVO_API_KEY not set, skipping confirmation email');
		return;
	}

	try {
		const { subject, htmlContent, textContent } = renderEmail(
			'quote-received',
			submission.locale,
			{
				clientName: submission.clientInfo.name,
				studioName: submission.clientInfo.studioName || '',
				shareableUrl,
				expirationDate: formatDate(expirationDate, submission.locale),
				hasPendingItems: hasPendingItems ? 'true' : '',
				pendingItemCount: pendingItemCount.toString(),
			},
			submission.clientInfo.email
		);

		await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'api-key': brevoApiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sender: { name: 'Made in Bugs', email: 'hello@madeinbugs.com.br' },
				to: [{ email: submission.clientInfo.email, name: submission.clientInfo.name }],
				subject,
				htmlContent,
				textContent,
			}),
		});
	} catch (err) {
		console.error('[quote-request] Brevo email failed:', err);
	}
}

function buildSelectedItemSnapshots(
	submission: QuoteSubmission
): SelectedItemSnapshot[] {
	return submission.selectedItems.map((item) => {
		const service = getServiceById(item.serviceId)!;
		const currency = submission.currency;

		const configurations = item.configurations.map((selConfig) => {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			return {
				configurationId: selConfig.configurationId,
				configurationLabel: config?.label || { en: selConfig.configurationId, 'pt-BR': selConfig.configurationId },
				selectedOptions: selConfig.selectedOptionIds.map((optionId) => {
					const option = config?.options.find((o) => o.id === optionId);
					return {
						optionId,
						optionLabel: option?.label || { en: optionId, 'pt-BR': optionId },
						priceModifier: option?.priceModifier || { BRL: 0, USD: 0 },
					};
				}),
			};
		});

		const customFields = item.customFields.map((cf) => {
			const fieldDef = service.customFields?.find((f) => f.id === cf.customFieldId);
			return {
				customFieldId: cf.customFieldId,
				customFieldLabel: fieldDef?.label || { en: cf.customFieldId, 'pt-BR': cf.customFieldId },
				values: cf.values,
				pendingPricing: fieldDef?.pendingPricing || false,
			};
		});

		const maintenanceInfo = computeMaintenanceForService(service, item, currency);

		// Collect deliverables for this service (including config options)
		const deliverables = [...service.clientDeliverables];
		for (const selConfig of item.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) continue;
			for (const optionId of selConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (option?.additionalDeliverables) {
					deliverables.push(...option.additionalDeliverables);
				}
			}
		}

		// Collect third-party costs for this service (including config options)
		const thirdPartyCosts = [...(service.thirdPartyCosts || [])];
		for (const selConfig of item.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) continue;
			for (const optionId of selConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (option?.thirdPartyCosts) {
					thirdPartyCosts.push(...option.thirdPartyCosts);
				}
			}
		}

		return {
			serviceId: service.id,
			serviceName: service.name,
			serviceCategory: service.category,
			basePrice: service.basePrice,
			configurations,
			customFields,
			maintenancePrice: maintenanceInfo ? { BRL: maintenanceInfo.total, USD: maintenanceInfo.total } : null,
			maintenanceBreakdown: maintenanceInfo ? {
				base: maintenanceInfo.base,
				modifiers: maintenanceInfo.modifiers,
			} : undefined,
			deliverables,
			thirdPartyCosts,
		};
	});
}

export async function POST(request: NextRequest) {
	// Feature flag check
	if (process.env.SERVICES_FEATURE_LIVE !== 'true') {
		return NextResponse.json(
			{ error: 'Services are currently in preview mode. Please check back soon.' },
			{ status: 503 }
		);
	}

	// Rate limit
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown';

	const rateLimitResult = await checkRateLimitRedis(`quote:${ip}`, 3, 60);
	if (!rateLimitResult.allowed) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again in a minute.' },
			{ status: 429 }
		);
	}

	// Parse body
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
	}

	// Zod validation
	const parseResult = QuoteSubmissionSchema.safeParse(body);
	if (!parseResult.success) {
		return NextResponse.json({ error: 'Invalid submission data.' }, { status: 400 });
	}

	const submission = parseResult.data as QuoteSubmission;

	// Honeypot double-check (Zod already enforces z.literal(''))
	if (submission.honeypot !== '') {
		// Silent success — don't reveal bot detection
		return NextResponse.json({ id: crypto.randomUUID(), shareableUrl: '' });
	}

	// Business rule validation
	const validationResult = validateSubmissionAgainstCatalog(submission, SERVICE_CATALOG);
	if (!validationResult.ok) {
		return NextResponse.json(
			{ error: validationResult.error, code: validationResult.code },
			{ status: 400 }
		);
	}

	const { computedTotals } = validationResult;
	const currency = submission.currency as Currency;

	// Generate UUID and HMAC signature
	const uuid = crypto.randomUUID();
	const signature = signQuoteId(uuid);

	// Compute expiration (30 days)
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	// Hash IP
	const ipHash = hashIp(ip);

	// Build snapshot
	const selectedItemSnapshots = buildSelectedItemSnapshots(submission);

	// Pending items
	const { hasPending, count: pendingCount } = countPendingItems(SERVICE_CATALOG, submission.selectedItems);

	// Insert into Supabase
	const supabase = createServiceClient();
	const { error: dbError } = await supabase.from('quote_requests').insert({
		id: uuid,
		created_at: now.toISOString(),
		expires_at: expiresAt.toISOString(),
		status: 'new',
		locale: submission.locale,
		currency: submission.currency,
		client_name: submission.clientInfo.name,
		client_email: submission.clientInfo.email,
		studio_name: submission.clientInfo.studioName || null,
		studio_website: submission.clientInfo.studioWebsite || null,
		message: submission.clientInfo.message || null,
		selected_items: selectedItemSnapshots,
		setup_price: computedTotals.setup,
		total_price: computedTotals.grandTotal,
		has_pending_items: hasPending,
		pending_item_count: pendingCount,
		maintenance_months: submission.maintenanceMonths,
		maintenance_monthly_price: computedTotals.maintenanceMonthly,
		maintenance_total: computedTotals.maintenanceTotal,
		ref_param: submission.refParam || null,
		ip_hash: ipHash,
		user_agent: request.headers.get('user-agent') || null,
		consent_accepted: true,
		consent_accepted_at: now.toISOString(),
		terms_version: submission.termsVersion,
		catalog_version: CATALOG_VERSION,
		url_signature: signature,
	});

	if (dbError) {
		console.error('[quote-request] Supabase insert failed:', dbError);
		return NextResponse.json(
			{ error: 'An error occurred while processing your request. Please try again.' },
			{ status: 500 }
		);
	}

	// Build shareable URL
	const shareableUrl = buildQuoteUrl(submission.locale as Locale, uuid);

	// Price drift warning (within 10% but > 0.01)
	const diff = Math.abs(computedTotals.grandTotal - submission.clientComputedTotal);
	if (diff > 0.01 && computedTotals.grandTotal > 0) {
		const driftPercent = diff / computedTotals.grandTotal;
		if (driftPercent <= 0.10) {
			await sendDiscordWebhook({
				username: 'Infra Builder',
				content: `⚠️ Price drift detected on quote ${uuid}: client=${submission.clientComputedTotal}, server=${computedTotals.grandTotal} (${(driftPercent * 100).toFixed(1)}%)`,
			});
		}
	}

	// Fire Discord webhook (non-blocking)
	const serviceList = submission.selectedItems
		.map((item) => {
			const service = getServiceById(item.serviceId);
			return `• ${service?.name[submission.locale] || item.serviceId}`;
		})
		.join('\n');

	sendDiscordWebhook({
		username: 'Infra Builder',
		embeds: [{
			title: `New quote request: ${submission.clientInfo.studioName || submission.clientInfo.name}`,
			url: shareableUrl,
			color: 0x00c69c,
			fields: [
				{ name: 'Client', value: `${submission.clientInfo.name}\n${submission.clientInfo.email}`, inline: true },
				{ name: 'Studio', value: submission.clientInfo.studioName || '—', inline: true },
				{ name: 'Website', value: submission.clientInfo.studioWebsite || '—', inline: true },
				{ name: 'Currency', value: submission.currency, inline: true },
				{ name: 'Setup total', value: formatPrice(computedTotals.setup, currency), inline: true },
				{
					name: 'Maintenance', value: submission.maintenanceMonths > 0
						? `${submission.maintenanceMonths}mo × ${formatPrice(computedTotals.maintenanceMonthly, currency)}`
						: 'None', inline: true
				},
				{ name: 'Grand total', value: formatPrice(computedTotals.grandTotal, currency), inline: false },
				{ name: 'Pending items', value: hasPending ? `⏱ ${pendingCount} items need review` : 'None', inline: false },
				{ name: 'Services', value: serviceList, inline: false },
				{ name: 'Message', value: submission.clientInfo.message ? submission.clientInfo.message.slice(0, 500) : '—', inline: false },
				{ name: 'Source', value: submission.refParam || 'direct', inline: true },
				{ name: 'Locale', value: submission.locale, inline: true },
			],
			footer: { text: `Quote ID: ${uuid}` },
			timestamp: new Date().toISOString(),
		}],
	}).catch(() => { }); // Non-blocking

	// Send confirmation email (non-blocking)
	sendConfirmationEmail(
		submission,
		shareableUrl,
		expiresAt,
		hasPending,
		pendingCount
	).catch(() => { }); // Non-blocking

	// Set HTTP-only cookie for the quote-sent page
	const cookieStore = await cookies();
	cookieStore.set('mib_quote_session', `${uuid}:${signature}`, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 600, // 10 minutes
	});

	return NextResponse.json({
		id: uuid,
		shareableUrl,
	});
}
