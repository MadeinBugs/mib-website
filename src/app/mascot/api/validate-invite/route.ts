import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const { code } = await request.json();

		if (!code || typeof code !== 'string') {
			return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
		}

		// Use the service role key to bypass RLS for invite code validation
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
			{ cookies: { getAll: () => [], setAll: () => { } } }
		);

		const { data: inviteCode, error } = await supabase
			.from('invite_codes')
			.select('id, code, max_uses, current_uses, expires_at')
			.eq('code', code.trim())
			.single();

		if (error || !inviteCode) {
			return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
		}

		// Check expiration
		if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
			return NextResponse.json({ error: 'This invite code has expired' }, { status: 400 });
		}

		// Check usage limit
		if (inviteCode.current_uses >= inviteCode.max_uses) {
			return NextResponse.json({ error: 'This invite code has been fully used' }, { status: 400 });
		}

		return NextResponse.json({ inviteCodeId: inviteCode.id });
	} catch {
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
