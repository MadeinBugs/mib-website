import { NextRequest, NextResponse } from 'next/server';
import { updateContact, BREVO_LISTS } from '../../../../lib/brevo';
import { rateLimit } from '../../../../lib/rate-limit';

const VALID_TAGS = ['studio', 'devlog'] as const;

const TAG_TO_LIST: Record<string, number> = {
	studio: BREVO_LISTS.STUDIO,
	devlog: BREVO_LISTS.DEVLOG,
};

function getClientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'
	);
}

export async function POST(request: NextRequest) {
	try {
		// Rate limit: 5 requests per IP per 60 seconds
		const ip = getClientIp(request);
		const { allowed } = rateLimit(`preferences:${ip}`, 5, 60_000);
		if (!allowed) {
			return NextResponse.json(
				{ error: 'Too many requests. Please try again later.' },
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { email, tags } = body as { email?: string; tags?: string[] };

		if (!email || typeof email !== 'string') {
			return NextResponse.json(
				{ error: 'Email is required.' },
				{ status: 400 }
			);
		}

		if (!Array.isArray(tags)) {
			return NextResponse.json(
				{ error: 'Tags must be an array.' },
				{ status: 400 }
			);
		}

		// Filter to only valid tags
		const validTags = tags.filter((t): t is typeof VALID_TAGS[number] =>
			VALID_TAGS.includes(t as typeof VALID_TAGS[number])
		);

		if (validTags.length === 0) {
			return NextResponse.json({ success: true });
		}

		const listIds = validTags.map((tag) => TAG_TO_LIST[tag]);

		await updateContact(email.trim().toLowerCase(), { listIds });

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[newsletter/preferences] Error:', error);
		return NextResponse.json(
			{ error: 'Something went wrong.' },
			{ status: 500 }
		);
	}
}
