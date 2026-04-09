import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const supabase = await createClient();
	await supabase.auth.signOut();

	const url = request.nextUrl.clone();
	url.pathname = '/mascot/login';
	return NextResponse.redirect(url);
}
