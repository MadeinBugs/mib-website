// HMAC-based unsubscribe URL generation and verification.
// Uses UNSUBSCRIBE_SECRET env var for signing.

import { createHmac, timingSafeEqual } from 'crypto';

function getSecret(): string {
	const secret = process.env.UNSUBSCRIBE_SECRET;
	if (!secret) throw new Error('UNSUBSCRIBE_SECRET is not set');
	return secret;
}

function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madeinbugs.com.br';
}

/**
 * Generate an HMAC-SHA256 signature for the given email.
 */
function signEmail(email: string): string {
	return createHmac('sha256', getSecret())
		.update(email.toLowerCase())
		.digest('hex');
}

/**
 * Build a signed unsubscribe URL for the given email and locale.
 */
export function generateUnsubscribeUrl(email: string, locale: 'pt-BR' | 'en'): string {
	const sig = signEmail(email);
	const params = new URLSearchParams({ email: email.toLowerCase(), sig });
	return `${getSiteUrl()}/${locale}/newsletter/unsubscribe?${params.toString()}`;
}

/**
 * Verify that the signature matches the email.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export function verifyUnsubscribeSignature(email: string, sig: string): boolean {
	const expected = signEmail(email);
	const sigBuf = Buffer.from(sig, 'utf-8');
	const expectedBuf = Buffer.from(expected, 'utf-8');

	if (sigBuf.length !== expectedBuf.length) return false;
	return timingSafeEqual(sigBuf, expectedBuf);
}
