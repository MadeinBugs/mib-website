import { NextRequest, NextResponse } from 'next/server';
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { generateFingerprint } from '@/lib/contest/fingerprint';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
	// Check voting window
	const votingOpen = process.env.VOTING_OPEN === 'true';
	const closesAt = process.env.VOTING_CLOSES_AT;
	if (!votingOpen || (closesAt && new Date() > new Date(closesAt))) {
		return NextResponse.json({ error: 'Voting is closed' }, { status: 403 });
	}

	const { picture_id, hcaptcha_token } = await request.json();
	if (!picture_id) {
		return NextResponse.json({ error: 'Missing picture_id' }, { status: 400 });
	}

	// Generate fingerprint
	const headersList = await headers();
	const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
	const userAgent = headersList.get('user-agent') ?? 'unknown';
	const fingerprint = generateFingerprint(ip, userAgent);

	const supabase = createPictureContestServiceClient();

	// Check if this fingerprint has voted before — skip captcha if so
	const { data: existingVotes } = await supabase
		.from('contest_votes')
		.select('id')
		.eq('voter_fingerprint', fingerprint)
		.limit(1);

	const hasVotedBefore = (existingVotes?.length ?? 0) > 0;

	if (!hasVotedBefore) {
		if (!hcaptcha_token) {
			return NextResponse.json({ error: 'Captcha required for first vote' }, { status: 400 });
		}
		const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptcha_token}`,
		});
		const captchaData = await captchaRes.json();
		if (!captchaData.success) {
			return NextResponse.json({ error: 'Captcha failed' }, { status: 403 });
		}
	}

	// Insert vote
	const { error } = await supabase
		.from('contest_votes')
		.insert({ picture_id, voter_fingerprint: fingerprint });

	if (error) {
		if (error.code === '23505') {
			return NextResponse.json({ error: 'Already voted' }, { status: 409 });
		}
		return NextResponse.json({ error: 'Database error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
