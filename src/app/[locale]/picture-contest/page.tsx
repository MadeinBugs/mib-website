import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import SessionGrid from '@/components/picture-contest/SessionGrid';

export default async function PictureContestPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const supabase = await createPictureContestClient();

	// Fetch all sessions with their pictures' storage paths
	const { data: sessions } = await supabase
		.from('contest_sessions')
		.select('unique_id, created_at, machine_id, contest_pictures(storage_path)')
		.order('created_at', { ascending: false });

	if (!sessions || sessions.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<h1 className="font-h2 text-3xl font-bold text-neutral-800 mb-8">
					Photo Contest Gallery
				</h1>
				<SessionGrid sessions={[]} locale={locale} />
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
	let signedUrlMap = new Map<number, string>();
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

	// Build session data for the grid
	const sessionData = sessions.map((session, index) => ({
		unique_id: session.unique_id,
		created_at: session.created_at,
		machine_id: session.machine_id,
		pictureCount: (session.contest_pictures as { storage_path: string }[]).length,
		previewUrl: signedUrlMap.get(index) ?? null,
	}));

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			<h1 className="font-h2 text-3xl font-bold text-neutral-800 mb-8">
				Photo Contest Gallery
			</h1>
			<SessionGrid sessions={sessionData} locale={locale} />
		</div>
	);
}
