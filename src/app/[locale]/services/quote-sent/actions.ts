'use server';

import { cookies } from 'next/headers';

export async function clearQuoteSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set('mib_quote_session', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	});
}
