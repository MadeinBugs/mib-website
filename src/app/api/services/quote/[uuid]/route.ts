import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyQuoteSignature } from '@/lib/services/quote-url';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	const { uuid } = await params;
	const sig = request.nextUrl.searchParams.get('sig');

	if (!sig) {
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

	// Verify signature with timing-safe comparison
	if (!verifyQuoteSignature(uuid, sig)) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	// Auto-expire if status is 'new' and past expiration
	if (quote.status === 'new' && new Date(quote.expires_at) < new Date()) {
		await supabase
			.from('quote_requests')
			.update({ status: 'expired' })
			.eq('id', uuid);
		quote.status = 'expired';
	}

	// Return public-safe subset
	return NextResponse.json({
		id: quote.id,
		created_at: quote.created_at,
		expires_at: quote.expires_at,
		status: quote.status,
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
		response_notes: quote.status !== 'new' ? quote.response_notes : null,
		response_sent_at: quote.status !== 'new' ? quote.response_sent_at : null,
	});
}
