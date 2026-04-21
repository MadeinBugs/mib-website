import { createClient } from '@supabase/supabase-js';

// Service role client for server-side writes only (API routes).
// NEVER expose the service role key to the client.
// Uses the main Supabase project for infra builder services.
export function createServiceClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
			},
		}
	);
}
