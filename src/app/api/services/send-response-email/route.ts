import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-auth';
import { createServiceClient } from '@/lib/supabase/service';
import { buildQuoteUrl } from '@/lib/services/quote-url';
import { renderEmail } from '@/emails/render';

const Schema = z.object({
	quoteId: z.string().uuid(),
	notes: z.string().max(10_000).optional(),
});

export async function POST(request: NextRequest) {
	const adminCheck = await verifyAdmin();
	if (!adminCheck.ok) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parsed = Schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}

	const { quoteId, notes } = parsed.data;

	const supabase = createServiceClient();
	const { data: quote, error: fetchError } = await supabase
		.from('quote_requests')
		.select('id, client_name, client_email, locale, url_signature, response_notes')
		.eq('id', quoteId)
		.single();

	if (fetchError || !quote) {
		return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
	}

	// Notes from request body take precedence over stored notes
	const responseNotes = notes?.trim() ?? quote.response_notes?.trim() ?? '';
	if (!responseNotes) {
		return NextResponse.json({ error: 'Response notes are required' }, { status: 400 });
	}

	const locale = quote.locale as 'en' | 'pt-BR';
	const shareableUrl = buildQuoteUrl(locale, quoteId);

	let emailPayload: { subject: string; htmlContent: string; textContent: string };
	try {
		emailPayload = renderEmail('quote-response', locale, {
			clientName: quote.client_name,
			shareableUrl,
			responseNotes,
		});
	} catch (err) {
		console.error('[send-response-email] renderEmail failed:', err);
		return NextResponse.json({ error: 'Failed to render email template' }, { status: 500 });
	}

	const brevoApiKey = process.env.BREVO_API_KEY;
	if (!brevoApiKey) {
		return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 });
	}

	const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			'api-key': brevoApiKey,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sender: {
				name: process.env.BREVO_SENDER_NAME ?? 'Made in Bugs',
				email: process.env.BREVO_SENDER_EMAIL ?? 'hello@madeinbugs.com.br',
			},
			to: [{ email: quote.client_email, name: quote.client_name }],
			subject: emailPayload.subject,
			htmlContent: emailPayload.htmlContent,
			textContent: emailPayload.textContent,
		}),
	});

	if (!brevoRes.ok) {
		const brevoBody = await brevoRes.text();
		console.error('[send-response-email] Brevo error:', brevoRes.status, brevoBody);
		return NextResponse.json({ error: 'Failed to send email via Brevo' }, { status: 500 });
	}

	// Persist notes and response_sent_at
	await supabase
		.from('quote_requests')
		.update({
			response_notes: responseNotes,
			response_sent_at: new Date().toISOString(),
		})
		.eq('id', quoteId);

	return NextResponse.json({ ok: true });
}
