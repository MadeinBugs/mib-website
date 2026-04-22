import { createClient } from '@/lib/supabase/server';

/**
 * Verifies that the current request comes from an authenticated admin user.
 * Uses the main Supabase project's profiles table.
 * Must only be called from Server Components or Route Handlers (requires cookies).
 */
export async function verifyAdmin(): Promise<{ ok: true; userId: string } | { ok: false }> {
	try {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return { ok: false };

		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (profile?.role !== 'admin') return { ok: false };
		return { ok: true, userId: user.id };
	} catch {
		return { ok: false };
	}
}
