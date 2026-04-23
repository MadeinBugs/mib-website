import { NextRequest, NextResponse } from 'next/server';
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { generateFingerprint } from '@/lib/contest/fingerprint';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
	const votingOpen = process.env.VOTING_OPEN === 'true';
	const closesAt = process.env.VOTING_CLOSES_AT;
	if (!votingOpen || (closesAt && new Date() > new Date(closesAt))) {
		return NextResponse.json({ error: 'Voting is closed' }, { status: 403 });
	}

	const { picture_id } = await request.json();
	if (!picture_id) {
		return NextResponse.json({ error: 'Missing picture_id' }, { status: 400 });
	}

	const headersList = await headers();
	const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
	const userAgent = headersList.get('user-agent') ?? 'unknown';
	const fingerprint = generateFingerprint(ip, userAgent);

	const supabase = createPictureContestServiceClient();
	const { error } = await supabase
		.from('contest_votes')
		.delete()
		.eq('picture_id', picture_id)
		.eq('voter_fingerprint', fingerprint);

	if (error) {
		return NextResponse.json({ error: 'Database error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
