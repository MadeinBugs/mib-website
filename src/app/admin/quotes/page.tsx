import { createServiceClient } from '@/lib/supabase/service';
import QuoteListClient from '@/components/admin/QuoteListClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Quotes — Admin · Made in Bugs',
};

export default async function AdminQuotesPage() {
	const supabase = createServiceClient();
	const { data: quotes, error } = await supabase
		.from('quote_requests')
		.select(
			'id, status, created_at, updated_at, expires_at, client_name, client_email, studio_name, locale, currency, setup_price, maintenance_months, total_price, twenty_opportunity_id, response_sent_at, ref_param'
		)
		.order('created_at', { ascending: false });

	if (error) {
		return (
			<div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-red-400">
				<p className="font-semibold mb-1">Failed to load quotes</p>
				<p className="text-sm font-mono">{error.message}</p>
			</div>
		);
	}

	return <QuoteListClient quotes={quotes ?? []} />;
}
