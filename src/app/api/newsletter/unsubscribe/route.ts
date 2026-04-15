import { NextRequest, NextResponse } from 'next/server';
import { updateContact, BREVO_LISTS } from '../../../../lib/brevo';
import { verifyUnsubscribeSignature } from '../../../../lib/unsubscribe';
import { rateLimit } from '../../../../lib/rate-limit';

function getClientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	);
}

export async function POST(request: NextRequest) {
	try {
		const ip = getClientIp(request);
		const { allowed } = rateLimit(`unsubscribe:${ip}`, 5, 60_000);
		if (!allowed) {
			return NextResponse.json(
				{ error: 'Too many requests. Please try again later.' },
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { email, sig } = body as { email?: string; sig?: string };

		if (!email || !sig || typeof email !== 'string' || typeof sig !== 'string') {
			return NextResponse.json(
				{ error: 'Missing email or signature.' },
				{ status: 400 }
			);
		}

		if (!verifyUnsubscribeSignature(email, sig)) {
			return NextResponse.json(
				{ error: 'Invalid signature.' },
				{ status: 403 }
			);
		}

		// Remove contact from all newsletter lists (don't delete the contact)
		await updateContact(email.trim().toLowerCase(), {
			unlinkListIds: [BREVO_LISTS.ASUMI, BREVO_LISTS.STUDIO, BREVO_LISTS.DEVLOG],
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[newsletter/unsubscribe] Error:', error);
		return NextResponse.json(
			{ error: 'Something went wrong.' },
			{ status: 500 }
		);
	}
}
