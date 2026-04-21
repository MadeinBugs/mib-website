import crypto from 'crypto';
import type { Locale } from './types';

function getSecret(): string {
	const secret = process.env.QUOTE_URL_SECRET;
	if (!secret) throw new Error('QUOTE_URL_SECRET is not set');
	return secret;
}

function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madeinbugs.com.br';
}

export function signQuoteId(uuid: string): string {
	return crypto
		.createHmac('sha256', getSecret())
		.update(uuid)
		.digest('hex');
}

export function verifyQuoteSignature(uuid: string, sig: string): boolean {
	const expected = signQuoteId(uuid);
	if (sig.length !== expected.length) return false;
	return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function buildQuoteUrl(locale: Locale, uuid: string, baseUrl?: string): string {
	const sig = signQuoteId(uuid);
	const base = baseUrl || getSiteUrl();
	return `${base}/${locale}/services/quote/${uuid}?sig=${sig}`;
}
