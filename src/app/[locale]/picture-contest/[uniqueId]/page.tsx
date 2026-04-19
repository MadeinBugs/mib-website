import Link from 'next/link';
import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import PlayerGallery from '@/components/picture-contest/PlayerGallery';
import { redirect } from 'next/navigation';

export default async function PlayerPage({
	params,
}: {
	params: Promise<{ locale: string; uniqueId: string }>;
}) {
	const { locale, uniqueId } = await params;
	const code = uniqueId.toUpperCase();
	const supabase = await createPictureContestClient();

	// Fetch session info
	const { data: session } = await supabase
		.from('contest_sessions')
		.select('unique_id, created_at')
		.eq('unique_id', code)
		.single();

	if (!session) {
		redirect(`/${locale}/picture-contest`);
	}

	// Fetch all pictures in this session
	const { data: pictures } = await supabase
		.from('contest_pictures')
		.select('id, unique_id, filename, storage_path, picture_index, taken_at, metadata, is_favorite_1, is_favorite_2')
		.eq('unique_id', code)
		.order('picture_index', { ascending: true });

	// Fetch existing favorites
	const { data: favorites } = await supabase
		.from('contest_favorites')
		.select('picture_id, favorite_slot')
		.eq('unique_id', code);

	// Generate signed URLs for all pictures in one request
	const storagePaths = (pictures ?? []).map((p) => p.storage_path);
	const signedUrlMap = new Map<string, string>();

	storagePaths.forEach((path) => {
		const { data } = supabase.storage
			.from('contest-pictures')
			.getPublicUrl(path);

		if (data?.publicUrl) {
			signedUrlMap.set(path, data.publicUrl);
		}
	});

	const picturesWithUrls = (pictures ?? []).map((picture) => ({
		id: picture.id,
		filename: picture.filename,
		signedUrl: signedUrlMap.get(picture.storage_path) ?? null,
		picture_index: picture.picture_index,
		taken_at: picture.taken_at,
		metadata: picture.metadata as Record<string, unknown> | null,
		is_favorite_1: picture.is_favorite_1 ?? false,
		is_favorite_2: picture.is_favorite_2 ?? false,
	}));

	const favoriteCount = favorites?.length ?? 0;

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Back link */}
			<Link
				href={`/${locale}/picture-contest`}
				className="inline-flex items-center text-[#04c597] hover:text-[#36c8ab] font-body font-semibold mb-6 transition-colors"
			>
				&larr; {locale === 'en' ? 'Back' : 'Voltar'}
			</Link>

			<PlayerGallery
				pictures={picturesWithUrls}
				uniqueId={code}
				favoriteCount={favoriteCount}
			/>
		</div>
	);
}
