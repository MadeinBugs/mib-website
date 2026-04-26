import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { orderPhotosForVoting } from '@/lib/contest/voting-algorithm';
import VotingPageClient from '@/components/picture-contest/VotingPageClient';

export const dynamic = 'force-dynamic';

export default async function VotingPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale: rawLocale } = await params;
	const locale = rawLocale === 'en' ? 'en' : 'pt-BR';

	const votingOpen = process.env.VOTING_OPEN === 'true';
	const closesAt = process.env.VOTING_CLOSES_AT ?? null;
	const isExpired = closesAt ? new Date() > new Date(closesAt) : false;
	const isActive = votingOpen && !isExpired;

	const supabase = createPictureContestServiceClient();

	// Fetch only photos that were chosen as favorites
	// IMPORTANT: do NOT select unique_id — never expose it on this page
	const { data: favorites } = await supabase
		.from('contest_favorites')
		.select('picture_id');

	const favoriteIds = (favorites ?? []).map((f: { picture_id: number }) => f.picture_id);

	if (favoriteIds.length === 0) {
		return (
			<VotingPageClient
				photos={[]}
				locale={locale}
				isActive={isActive}
				closesAt={closesAt}
			/>
		);
	}

	const { data: photos } = await supabase
		.from('contest_pictures')
		.select('id, storage_path')
		.in('id', favoriteIds);

	// Fetch vote counts via SECURITY DEFINER function
	const { data: voteCounts } = await supabase.rpc('get_vote_counts');

	const voteMap = new Map<number, number>(
		(voteCounts ?? []).map((v: { picture_id: number; vote_count: number }) =>
			[v.picture_id, Number(v.vote_count)]
		)
	);

	const photosWithCounts = (photos ?? []).map((p: { id: number; storage_path: string }) => ({
		id: p.id,
		pictureId: p.id,
		storagePath: p.storage_path,
		voteCount: voteMap.get(p.id) ?? 0,
	}));

	// Generate public URLs (bucket is public)
	const photosWithUrls = photosWithCounts.map((p) => {
		const { data } = supabase.storage
			.from('contest-pictures')
			.getPublicUrl(p.storagePath);
		return { ...p, imageUrl: data?.publicUrl ?? null };
	});

	const seed = Math.floor(Date.now() / 60_000);
	const orderedPhotos = orderPhotosForVoting(photosWithUrls, seed);

	return (
		<VotingPageClient
			photos={orderedPhotos}
			locale={locale}
			isActive={isActive}
			closesAt={closesAt}
		/>
	);
}
