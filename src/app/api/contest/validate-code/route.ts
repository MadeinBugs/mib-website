import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const CODE_REGEX = /^[BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ]$/;

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get('code')?.trim().toUpperCase();

	if (!code || !CODE_REGEX.test(code)) {
		return NextResponse.json({ exists: false });
	}

	const supabase = createClient(
		process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY!
	);

	const { data } = await supabase
		.from('contest_sessions')
		.select('unique_id')
		.eq('unique_id', code)
		.single();

	return NextResponse.json({ exists: !!data });
}
