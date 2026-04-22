import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/service';
import { buildQuoteUrl } from '@/lib/services/quote-url';
import QuoteDetailClient from '@/components/admin/QuoteDetailClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	return { title: `Quote ${id.slice(0, 8)} — Admin · Made in Bugs` };
}

export default async function AdminQuoteDetailPage({ params }: Props) {
	const { id } = await params;

	const supabase = createServiceClient();
	const { data: quote, error } = await supabase
		.from('quote_requests')
		.select('*')
		.eq('id', id)
		.single();

	if (error || !quote) notFound();

	const shareableUrl = buildQuoteUrl(quote.locale as 'en' | 'pt-BR', id);

	return <QuoteDetailClient quote={quote} shareableUrl={shareableUrl} />;
}
