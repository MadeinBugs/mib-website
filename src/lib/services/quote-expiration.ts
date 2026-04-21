import { createServiceClient } from '@/lib/supabase/service';

/**
 * If a quote has status 'new' and is past its expiration date, mark it as 'expired'.
 * Returns the (possibly updated) status string.
 */
export async function autoExpireQuote(
	quoteId: string,
	currentStatus: string,
	expiresAt: string
): Promise<string> {
	if (currentStatus !== 'new') return currentStatus;
	if (new Date(expiresAt) >= new Date()) return currentStatus;

	const supabase = createServiceClient();
	await supabase
		.from('quote_requests')
		.update({ status: 'expired' })
		.eq('id', quoteId);

	return 'expired';
}
