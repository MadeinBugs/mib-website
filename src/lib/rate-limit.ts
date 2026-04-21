/**
 * @deprecated Use `rate-limit-redis.ts` (Upstash-based) for new features.
 * This in-memory limiter is kept for backward compatibility with newsletter endpoints.
 * It does NOT persist across Vercel cold starts.
 */

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to avoid memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL) return;
	lastCleanup = now;
	for (const [key, entry] of store) {
		if (now > entry.resetAt) {
			store.delete(key);
		}
	}
}

/**
 * Check if a request is allowed under the rate limit.
 * @param key - Unique identifier (typically IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns { allowed: boolean, remaining: number }
 */
export function rateLimit(
	key: string,
	maxRequests: number,
	windowMs: number
): { allowed: boolean; remaining: number } {
	cleanup();

	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, remaining: maxRequests - 1 };
	}

	entry.count++;

	if (entry.count > maxRequests) {
		return { allowed: false, remaining: 0 };
	}

	return { allowed: true, remaining: maxRequests - entry.count };
}
