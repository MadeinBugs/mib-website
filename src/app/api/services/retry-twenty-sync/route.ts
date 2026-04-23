import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-auth';
import { createServiceClient } from '@/lib/supabase/service';

const Schema = z.object({
	quoteId: z.string().uuid(),
});

async function notifyDiscord(url: string, embeds: object[]): Promise<void> {
	try {
		await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ embeds }),
		});
	} catch {
		// Non-fatal — best-effort notification
	}
}

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

	const { quoteId } = parsed.data;

	const supabase = createServiceClient();
	const { data: quote, error: fetchError } = await supabase
		.from('quote_requests')
		.select('*')
		.eq('id', quoteId)
		.single();

	if (fetchError || !quote) {
		return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
	}

	const webhookUrl = process.env.N8N_QUOTE_WEBHOOK_URL;
	if (!webhookUrl) {
		return NextResponse.json({ error: 'N8N_QUOTE_WEBHOOK_URL is not configured' }, { status: 500 });
	}

	const webhookSecret = process.env.N8N_QUOTE_WEBHOOK_SECRET;
	const webhookHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
	if (webhookSecret) webhookHeaders['Authorization'] = `Bearer ${webhookSecret}`;

	const syncWebhookUrl = process.env.DISCORD_QUOTE_SYNC_WEBHOOK_URL;

	try {
		const n8nRes = await fetch(webhookUrl, {
			method: 'POST',
			headers: webhookHeaders,
			body: JSON.stringify({
				type: 'INSERT',
				table: 'quote_requests',
				schema: 'public',
				record: quote,
				old_record: null,
			}),
		});

		if (!n8nRes.ok) {
			const n8nBody = await n8nRes.text();
			throw new Error(`n8n responded ${n8nRes.status}: ${n8nBody}`);
		}
	} catch (err) {
		console.error('[retry-twenty-sync] n8n webhook failed:', err);

		if (syncWebhookUrl) {
			await notifyDiscord(syncWebhookUrl, [{
				title: '⚠️ Retry Twenty Sync Failed',
				description: `**Quote ID:** \`${quoteId}\`\n**Studio:** ${quote.studio_name ?? quote.client_name}\n**Error:** ${err instanceof Error ? err.message : String(err)}`,
				color: 0xff6b35,
			}]);
		}

		return NextResponse.json({ error: 'Failed to trigger n8n webhook' }, { status: 500 });
	}

	// Success — notify secondary Discord webhook
	if (syncWebhookUrl) {
		await notifyDiscord(syncWebhookUrl, [{
			title: '🔄 Retry Twenty Sync Triggered',
			description: `**Quote ID:** \`${quoteId}\`\n**Studio:** ${quote.studio_name ?? quote.client_name}\n**Status:** ${quote.status}\n**Initiated by:** admin`,
			color: 0x2b9ca5,
		}]);
	}

	return NextResponse.json({ ok: true });
}
