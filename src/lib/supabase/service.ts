import { createClient } from '@supabase/supabase-js';

// Service role client for server-side writes only (API routes).
// NEVER expose the service role key to the client.
// Uses the main Supabase project for infra builder services.
export function createServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new Error('Supabase service client: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
	}
	return createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}
