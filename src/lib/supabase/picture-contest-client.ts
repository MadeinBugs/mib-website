import { createBrowserClient } from '@supabase/ssr';

export function createPictureContestClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_PICTURE_CONTEST_SUPABASE_ANON_KEY!
	);
}
