import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
	getContact,
	createContact,
	updateContact,
	sendTransactionalEmail,
	BREVO_LISTS,
} from '../../../../lib/brevo';
import { rateLimit } from '../../../../lib/rate-limit';
import {
	buildConfirmationEmail,
	getConfirmationEmailSubject,
} from '../../../../lib/newsletter-email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madeinbugs.com.br';
}

function getClientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	);
}

export async function POST(request: NextRequest) {
	try {
		// Rate limit: 3 requests per IP per 60 seconds
		const ip = getClientIp(request);
		const { allowed } = rateLimit(`subscribe:${ip}`, 3, 60_000);
		if (!allowed) {
			return NextResponse.json(
				{ error: 'Too many requests. Please try again later.' },
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { email, locale, company } = body as {
			email?: string;
			locale?: string;
			company?: string;
		};

		// Honeypot check — if filled, silently succeed
		if (company) {
			return NextResponse.json({ success: true });
		}

		// Validate email
		if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
			return NextResponse.json(
				{ error: 'Invalid email address.' },
				{ status: 400 }
			);
		}

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedLocale = locale === 'pt-BR' ? 'pt-BR' : 'en';

		// Check if contact already exists in Brevo
		const existingContact = await getContact(normalizedEmail);

		if (existingContact) {
			const attrs = existingContact.attributes;

			// Already confirmed or previously unsubscribed → silent success
			if (attrs?.CONFIRMED === true) {
				return NextResponse.json({ success: true });
			}

			// Not confirmed yet → generate new token and resend
			const token = randomUUID();
			const now = new Date().toISOString();

			await updateContact(normalizedEmail, {
				attributes: {
					CONFIRMATION_TOKEN: token,
					CONFIRMATION_CREATED_AT: now,
					LOCALE: normalizedLocale,
				},
			});

			await sendConfirmationEmail(normalizedEmail, token, normalizedLocale);

			// Discord notification
			if (process.env.DISCORD_NOTIF_WEBHOOK_URL) {
				await fetch(process.env.DISCORD_NOTIF_WEBHOOK_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						content: `⚠️ Alguém solicitou o reenvio de confirmação da Bugsletter.`,
					}),
				}).catch(() => { });
			}

			return NextResponse.json({ success: true });
		}

		// New contact → create and send confirmation
		const token = randomUUID();
		const now = new Date().toISOString();

		await createContact({
			email: normalizedEmail,
			listIds: [BREVO_LISTS.ASUMI],
			attributes: {
				CONFIRMED: false,
				CONFIRMATION_TOKEN: token,
				CONFIRMATION_CREATED_AT: now,
				LOCALE: normalizedLocale,
			},
		});

		await sendConfirmationEmail(normalizedEmail, token, normalizedLocale);

		// Discord notification
		if (process.env.DISCORD_NOTIF_WEBHOOK_URL) {
			await fetch(process.env.DISCORD_NOTIF_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: `📬 Nova inscrição na Bugsletter!`,
				}),
			}).catch(() => { });
		}

		console.log('[Newsletter] Subscribe success:', normalizedEmail);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[newsletter/subscribe] Error:', error);
		// Always return success to avoid leaking info
		return NextResponse.json({ success: true });
	}
}

async function sendConfirmationEmail(
	email: string,
	token: string,
	locale: 'pt-BR' | 'en'
) {
	const siteUrl = getSiteUrl();
	const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

	const htmlContent = buildConfirmationEmail({ confirmUrl, locale });
	const subject = getConfirmationEmailSubject(locale);

	await sendTransactionalEmail({
		to: [{ email }],
		subject,
		htmlContent,
		sender: { name: process.env.BREVO_SENDER_NAME!, email: process.env.BREVO_SENDER_EMAIL! },
	});
}