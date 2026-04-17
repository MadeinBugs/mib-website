import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ locale: string }> }
) {
	const { locale } = await params;
	const supabase = await createPictureContestClient();
	await supabase.auth.signOut();

	const url = request.nextUrl.clone();
	url.pathname = `/${locale}/picture-contest/login`;
	return NextResponse.redirect(url);
}
