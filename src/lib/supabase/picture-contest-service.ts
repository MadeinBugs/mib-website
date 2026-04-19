import { createClient } from '@supabase/supabase-js';

// Service role client for server-side writes only (API routes).
// NEVER expose the service role key to the client.
export function createPictureContestServiceClient() {
	return createClient(
		process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!,
		process.env.PICTURE_CONTEST_SUPABASE_SERVICE_ROLE_KEY!
	);
}
