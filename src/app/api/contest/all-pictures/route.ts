import { NextResponse } from 'next/server';
import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';

export async function GET() {
	const supabase = await createPictureContestClient();

	// Verify admin auth
	const { data: { user }, error: authError } = await supabase.auth.getUser();
	if (!user || authError) {
		return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
	}

	const { data: sessions, error } = await supabase
		.from('contest_sessions')
		.select(`
			unique_id,
			contest_pictures (
				id,
				storage_path,
				is_favorite_1,
				taken_at
			)
		`)
		.order('created_at', { ascending: false });

	if (error || !sessions) {
		return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
	}

	type PictureRow = {
		id: number;
		storage_path: string;
		is_favorite_1: boolean;
		taken_at: string | null;
	};

	const allPictures = sessions.flatMap((session) => {
		const pics = session.contest_pictures as PictureRow[];
		return pics.map((pic) => {
			const { data } = supabase.storage
				.from('contest-pictures')
				.getPublicUrl(pic.storage_path);
			return {
				id: pic.id,
				imageUrl: data?.publicUrl ?? null,
				sessionId: session.unique_id,
				isFavorite: pic.is_favorite_1,
				takenAt: pic.taken_at,
			};
		});
	});

	// Sort by taken_at descending (most recent first)
	allPictures.sort((a, b) => {
		if (!a.takenAt && !b.takenAt) return 0;
		if (!a.takenAt) return 1;
		if (!b.takenAt) return -1;
		return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
	});

	return NextResponse.json(allPictures);
}
