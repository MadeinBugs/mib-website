// Redis-based rate limiter using Upstash Redis REST API.
// Replaces the in-memory rate limiter for production use on Vercel.

let lastDiscordErrorAt = 0;
const DISCORD_ERROR_THROTTLE_MS = 60_000;

async function logToDiscord(message: string): Promise<void> {
	const now = Date.now();
	if (now - lastDiscordErrorAt < DISCORD_ERROR_THROTTLE_MS) return;
	lastDiscordErrorAt = now;

	const webhookUrl = process.env.DISCORD_QUOTE_WEBHOOK_URL;
	if (!webhookUrl) return;

	try {
		await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'Rate Limiter',
				content: `⚠️ Rate limit Redis error: ${message}`,
			}),
		});
	} catch {
		// Swallow — we can't log the logging failure
	}
}

interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: number;
}

export async function checkRateLimitRedis(
	identifier: string,
	limit: number,
	windowSeconds: number
): Promise<RateLimitResult> {
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

	if (!url || !token) {
		await logToDiscord('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured');
		return { allowed: true, remaining: limit - 1, resetAt: Date.now() + windowSeconds * 1000 };
	}

	const key = `rate-limit:${identifier}`;
	const now = Date.now();
	const resetAt = now + windowSeconds * 1000;

	try {
		// Use pipeline: INCR + EXPIRE (only set expire on first increment)
		const response = await fetch(`${url}/pipeline`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([
				['INCR', key],
				['EXPIRE', key, windowSeconds.toString(), 'NX'],
			]),
		});

		if (!response.ok) {
			throw new Error(`Upstash returned ${response.status}`);
		}

		const results = await response.json() as Array<{ result: number }>;
		const count = results[0].result;
		const remaining = Math.max(0, limit - count);

		return {
			allowed: count <= limit,
			remaining,
			resetAt,
		};
	} catch (error) {
		// Fail open: allow the request, log the error
		const message = error instanceof Error ? error.message : String(error);
		await logToDiscord(message);
		return { allowed: true, remaining: limit - 1, resetAt };
	}
}
