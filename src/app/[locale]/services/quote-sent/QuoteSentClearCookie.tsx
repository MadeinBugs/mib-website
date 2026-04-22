'use client';

import { useEffect } from 'react';
import { clearQuoteSessionCookie } from './actions';

export default function QuoteSentClearCookie() {
	useEffect(() => {
		clearQuoteSessionCookie().catch((err) => {
			if (process.env.NODE_ENV !== 'production') {
				console.warn('[QuoteSent] Failed to clear session cookie:', err);
			}
		});
	}, []);

	return null;
}
