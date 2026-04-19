import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import AdminGallery from '@/components/picture-contest/AdminGallery';

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
				is_favorite_2,
				discord_posted_at
			)
		`)
		.order('created_at', { ascending: false });

	if (!sessions || sessions.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<AdminGalleryHeader locale={locale} />
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

	// Generate signed URLs for all previews in a single request
	const signedUrlMap = new Map<number, string>();
	if (previewPaths.length > 0) {
		const { data: signedUrls } = await supabase.storage
			.from('contest-pictures')
			.createSignedUrls(previewPaths, 604800); // 7 days

		if (signedUrls) {
			signedUrls.forEach((item) => {
				if (item.signedUrl) {
					const sessionIndex = pathToSessionIndex.get(item.path!);
					if (sessionIndex !== undefined) {
						signedUrlMap.set(sessionIndex, item.signedUrl);
					}
				}
			});
		}
	}

	type PictureRow = {
		id: number;
		storage_path: string;
		is_favorite_1: boolean;
		is_favorite_2: boolean;
	};

	const sessionData = sessions.map((session, index) => {
		const pics = session.contest_pictures as PictureRow[];
		const favCount = pics.filter((p) => p.is_favorite_1 || p.is_favorite_2).length;

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

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			<AdminGalleryHeader locale={locale} />
			<AdminGallery sessions={sessionData} locale={locale} />
		</div>
	);
}

function AdminGalleryHeader({ locale }: { locale: string }) {
	return (
		<div className="flex items-center justify-between mb-8">
			<h1 className="font-h2 text-3xl font-bold text-neutral-800">
				{locale === 'en' ? 'Admin Gallery' : 'Galeria Admin'}
			</h1>
			<a
				href={`/${locale}/picture-contest/logout`}
				className="text-sm font-body text-primary-500 hover:text-primary-600 font-semibold transition-colors"
			>
				{locale === 'en' ? 'Sign out' : 'Sair'}
			</a>
		</div>
	);
}
