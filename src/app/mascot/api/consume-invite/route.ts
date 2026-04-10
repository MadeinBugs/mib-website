import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const { inviteCodeId, userId, displayName } = await request.json();

		if (!inviteCodeId || !userId || !displayName) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Use the service role key to bypass RLS for admin operations
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
			{ cookies: { getAll: () => [], setAll: () => { } } }
		);

		// Atomically increment the invite code usage
		const { data: inviteCode, error: fetchError } = await supabase
			.from('invite_codes')
			.select('id, max_uses, current_uses')
			.eq('id', inviteCodeId)
			.single();

		if (fetchError || !inviteCode) {
			return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
		}

		if (inviteCode.current_uses >= inviteCode.max_uses) {
			return NextResponse.json({ error: 'Invite code fully used' }, { status: 400 });
		}

		// Increment usage
		const { error: updateError } = await supabase
			.from('invite_codes')
			.update({ current_uses: inviteCode.current_uses + 1 })
			.eq('id', inviteCodeId)
			.eq('current_uses', inviteCode.current_uses); // Optimistic concurrency check

		if (updateError) {
			return NextResponse.json({ error: 'Failed to consume invite code' }, { status: 500 });
		}

		// Create user profile
		const { error: profileError } = await supabase
			.from('profiles')
			.insert({
				id: userId,
				display_name: displayName,
				invite_code_used: inviteCodeId,
			});

		if (profileError) {
			return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
