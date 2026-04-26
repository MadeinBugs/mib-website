import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import AdminGallery from '@/components/picture-contest/AdminGallery';
import GalleryPageClient from '@/components/picture-contest/GalleryPageClient';

export const metadata = {
	title: 'Admin Gallery — Photo Contest — Made in Bugs',
};

export default async function AdminGalleryPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const supabase = await createPictureContestClient();

	// Fetch all sessions with their pictures
	const { data: sessions } = await supabase
		.from('contest_sessions')
		.select(`
			unique_id,
			created_at,
			machine_id,
			game_version,
			contest_pictures (
				id,
				picture_index,
				storage_path,
				taken_at,
				is_favorite_1,
				discord_posted_at
			)
		`)
		.order('created_at', { ascending: false });

	if (!sessions || sessions.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<div className="flex items-center justify-between mb-8">
					<div role="heading" aria-level={1} style={{ fontFamily: "'Amatic SC', cursive", fontSize: 'clamp(3rem, 4vw + 1rem, 4rem)', fontWeight: 700, color: '#04c597', textShadow: '-1px 1px 0px #016a50' }}>
						{locale === 'en' ? 'Gallery' : 'Galeria'}
					</div>
					<a href={`/${locale}/picture-contest/logout`} className="text-sm font-body text-[#04c597] hover:text-[#36c8ab] font-semibold transition-colors">
						{locale === 'en' ? 'Sign out' : 'Sair'}
					</a>
				</div>
				<p className="text-neutral-500 font-body text-lg text-center py-20">
					{locale === 'en' ? 'No sessions yet' : 'Nenhuma sessão ainda'}
				</p>
			</div>
		);
	}

	// Collect first picture of each session for preview thumbnails
	const previewPaths: string[] = [];
	const pathToSessionIndex = new Map<string, number>();

	sessions.forEach((session, index) => {
		const pictures = session.contest_pictures as { storage_path: string }[];
		if (pictures.length > 0) {
			previewPaths.push(pictures[0].storage_path);
			pathToSessionIndex.set(pictures[0].storage_path, index);
		}
	});

	// Generate public URLs for all previews
	const signedUrlMap = new Map<number, string>();
	previewPaths.forEach((path) => {
		const { data } = supabase.storage
			.from('contest-pictures')
			.getPublicUrl(path);

		if (data?.publicUrl) {
			const sessionIndex = pathToSessionIndex.get(path);
			if (sessionIndex !== undefined) {
				signedUrlMap.set(sessionIndex, data.publicUrl);
			}
		}
	});

	type PictureRow = {
		id: number;
		storage_path: string;
		is_favorite_1: boolean;
	};

	const sessionData = sessions.map((session, index) => {
		const pics = session.contest_pictures as PictureRow[];
		const favCount = pics.filter((p) => p.is_favorite_1).length;

		return {
			unique_id: session.unique_id,
			created_at: session.created_at,
			machine_id: session.machine_id,
			game_version: session.game_version,
			pictureCount: pics.length,
			favoriteCount: favCount,
			previewUrl: signedUrlMap.get(index) ?? null,
		};
	});

	// Build flat list of ALL pictures with public URLs for the "all pictures" view
	const allPictures = sessions.flatMap((session) => {
		const pics = session.contest_pictures as {
			id: number;
			storage_path: string;
			is_favorite_1: boolean;
		}[];
		return pics.map((pic) => {
			const { data } = supabase.storage
				.from('contest-pictures')
				.getPublicUrl(pic.storage_path);
			return {
				id: pic.id,
				imageUrl: data?.publicUrl ?? null,
				sessionId: session.unique_id,
				isFavorite: pic.is_favorite_1,
			};
		});
	});

	return (
		<GalleryPageClient
			sessionData={sessionData}
			allPictures={allPictures}
			locale={locale}
		/>
	);
}
