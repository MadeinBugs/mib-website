'use client';

import { useEffect, useRef } from 'react';

declare global {
	interface Window {
		umami?: { track: (event: string, data?: Record<string, unknown>) => void };
	}
}

interface AbandonmentTrackerProps {
	itemCount: number;
	estimatedTotal: number;
	currency: string;
	submitted: boolean;
}

/**
 * Fires `quote_abandoned` via Umami when the user leaves the builder
 * without submitting, provided they spent >30s and selected ≥1 service.
 *
 * Uses `visibilitychange` (primary, reliable on mobile) + `beforeunload` (fallback).
 */
export default function AbandonmentTracker({
	itemCount,
	estimatedTotal,
	currency,
	submitted,
}: AbandonmentTrackerProps) {
	const mountTimestamp = useRef(Date.now());
	const firedRef = useRef(false);

	useEffect(() => {
		function fireAbandonment() {
			if (firedRef.current) return;
			if (submitted) return;
			if (itemCount < 1) return;

			const timeOnPageMs = Date.now() - mountTimestamp.current;
			if (timeOnPageMs <= 30_000) return;

			firedRef.current = true;

			const data = {
				itemCount,
				estimatedTotal,
				currency,
				timeOnPageSec: Math.round(timeOnPageMs / 1000),
			};

			// Prefer sendBeacon via Umami; fall back to keepalive fetch
			if (window.umami?.track) {
				window.umami.track('quote_abandoned', data);
			}
		}

		function handleVisibilityChange() {
			if (document.visibilityState === 'hidden') {
				fireAbandonment();
			}
		}

		function handleBeforeUnload() {
			fireAbandonment();
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [itemCount, estimatedTotal, currency, submitted]);

	return null;
}
