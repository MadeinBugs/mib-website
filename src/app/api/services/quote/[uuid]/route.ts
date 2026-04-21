import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyQuoteSignature } from '@/lib/services/quote-url';
import { autoExpireQuote } from '@/lib/services/quote-expiration';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	const { uuid } = await params;
	const sig = request.nextUrl.searchParams.get('sig');

	// Verify signature before DB fetch to avoid timing side-channel
	if (!sig || !verifyQuoteSignature(uuid, sig)) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	const supabase = createServiceClient();
	const { data: quote, error: dbError } = await supabase
		.from('quote_requests')
		.select('*')
		.eq('id', uuid)
		.single();

	if (dbError || !quote) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	// Auto-expire if status is 'new' and past expiration
	const status = await autoExpireQuote(uuid, quote.status, quote.expires_at);

	// Return public-safe subset
	return NextResponse.json({
		id: quote.id,
		created_at: quote.created_at,
		expires_at: quote.expires_at,
		status: status,
		locale: quote.locale,
		currency: quote.currency,
		client_name: quote.client_name,
		studio_name: quote.studio_name,
		studio_website: quote.studio_website,
		selected_items: quote.selected_items,
		setup_price: quote.setup_price,
		total_price: quote.total_price,
		has_pending_items: quote.has_pending_items,
		pending_item_count: quote.pending_item_count,
		maintenance_months: quote.maintenance_months,
		maintenance_monthly_price: quote.maintenance_monthly_price,
		maintenance_total: quote.maintenance_total,
		catalog_version: quote.catalog_version,
		response_notes: status !== 'new' ? quote.response_notes : null,
		response_sent_at: status !== 'new' ? quote.response_sent_at : null,
	});
}
