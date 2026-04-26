const SITE_ORIGIN = 'https://www.madeinbugs.com.br';
const SHLINK_HOST = 'go.madeinbugs.com.br';

export function withUtm(
	url: string,
	linkId: string,
	source: 'studio' | 'asumi'
): string {
	// Relative URL = internal, no UTM
	if (url.startsWith('/')) return url;

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return url;
	}

	// Absolute URL pointing to own site = internal
	if (parsed.origin === SITE_ORIGIN) return url;

	// Shlink URL = tracking via Shlink, no UTM (avoid double-tracking)
	if (parsed.hostname === SHLINK_HOST) return url;

	// External non-Shlink: apply UTM as fallback
	parsed.searchParams.set('utm_source', `links-${source}`);
	parsed.searchParams.set('utm_medium', 'bio');
	parsed.searchParams.set('utm_campaign', linkId);
	return parsed.toString();
}
