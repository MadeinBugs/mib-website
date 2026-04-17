import Link from 'next/link';
import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import PictureGallery from '@/components/picture-contest/PictureGallery';

export default async function SessionPage({
	params,
}: {
	params: Promise<{ locale: string; uniqueId: string }>;
}) {
	const { locale, uniqueId } = await params;
	const supabase = await createPictureContestClient();

	// Fetch session info
	const { data: session } = await supabase
		.from('contest_sessions')
		.select('unique_id, created_at, machine_id, game_version')
		.eq('unique_id', uniqueId)
		.single();

	// Fetch all pictures in this session
	const { data: pictures } = await supabase
		.from('contest_pictures')
		.select('id, unique_id, filename, storage_path, picture_index, taken_at, metadata')
		.eq('unique_id', uniqueId)
		.order('picture_index', { ascending: true });

	// Generate signed URLs for all pictures in one request
	const storagePaths = (pictures ?? []).map((p) => p.storage_path);
	let signedUrlMap = new Map<string, string>();

	if (storagePaths.length > 0) {
		const { data: signedUrls } = await supabase.storage
			.from('contest-pictures')
			.createSignedUrls(storagePaths, 604800); // 7 days

		if (signedUrls) {
			signedUrls.forEach((item) => {
				if (item.signedUrl && item.path) {
					signedUrlMap.set(item.path, item.signedUrl);
				}
			});
		}
	}

	const picturesWithUrls = (pictures ?? []).map((picture) => ({
		id: picture.id,
		filename: picture.filename,
		signedUrl: signedUrlMap.get(picture.storage_path) ?? '',
		picture_index: picture.picture_index,
		taken_at: picture.taken_at,
		metadata: picture.metadata as Record<string, unknown> | null,
	}));

	const formattedDate = session
		? new Date(session.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
		: '';

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Back link */}
			<Link
				href={`/${locale}/picture-contest`}
				className="inline-flex items-center text-amber-700 hover:text-amber-800 font-body font-semibold mb-6 transition-colors"
			>
				&larr; {locale === 'en' ? 'Back' : 'Voltar'}
			</Link>

			{/* Session header */}
			{session && (
				<div className="mb-8">
					<h1 className="font-h2 text-3xl font-bold text-neutral-800">
						{locale === 'en' ? 'Session' : 'Sessão'} {session.unique_id}
					</h1>
					<div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-500 font-body">
						<span>{formattedDate}</span>
						<span>Booth: {session.machine_id}</span>
						{session.game_version && <span>v{session.game_version}</span>}
					</div>
				</div>
			)}

			<PictureGallery pictures={picturesWithUrls} />
		</div>
	);
}
