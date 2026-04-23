import { createHash } from 'crypto';

export function generateFingerprint(ip: string, userAgent: string): string {
	return createHash('sha256')
		.update(`${ip}:${userAgent}`)
		.digest('hex');
}
