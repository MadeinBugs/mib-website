'use client';

import { useState } from 'react';
import PolaroidCard from './PolaroidCard';
import PictureModal from './PictureModal';
import ConfirmFavoriteModal from './ConfirmFavoriteModal';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface PictureData {
	id: number;
	filename: string;
	signedUrl: string;
	picture_index: number;
	taken_at: string | null;
	metadata: Record<string, unknown> | null;
	is_favorite_1: boolean;
	is_favorite_2: boolean;
}

export default function PlayerGallery({
	pictures,
	uniqueId,
	favoriteCount: initialFavoriteCount,
}: {
	pictures: PictureData[];
	uniqueId: string;
	favoriteCount: number;
}) {
	const { t } = usePictureContestLocale();
	const [selectedPicture, setSelectedPicture] = useState<PictureData | null>(null);
	const [confirmPicture, setConfirmPicture] = useState<PictureData | null>(null);
	const [localPictures, setLocalPictures] = useState(pictures);
	const [favCount, setFavCount] = useState(initialFavoriteCount);
	const [choosing, setChoosing] = useState(false);

	function getFavoriteSlot(pic: PictureData): number | null {
		if (pic.is_favorite_1) return 1;
		if (pic.is_favorite_2) return 2;
		return null;
	}

	async function handleChooseFavorite(picture: PictureData) {
		setChoosing(true);
		try {
			const res = await fetch('/api/contest/choose-favorite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					unique_id: uniqueId,
					picture_id: picture.id,
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				alert(t.favoriteError);
				setChoosing(false);
				setConfirmPicture(null);
				return;
			}

			// Update local state
			const slot = data.favorite_slot as number;
			setLocalPictures((prev) =>
				prev.map((p) =>
					p.id === picture.id
						? {
							...p,
							is_favorite_1: slot === 1 ? true : p.is_favorite_1,
							is_favorite_2: slot === 2 ? true : p.is_favorite_2,
						}
						: p
				)
			);
			setFavCount((c) => c + 1);
		} catch {
			alert(t.favoriteError);
		} finally {
			setChoosing(false);
			setConfirmPicture(null);
		}
	}

	if (localPictures.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-neutral-500 font-body text-lg">{t.noPictures}</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-8">
				<h1 className="font-h2 text-3xl font-bold text-neutral-800">
					{t.playerGalleryTitle(uniqueId)}
				</h1>
				<p className="text-sm text-neutral-500 font-body mt-2">
					{t.picturesCount(localPictures.length)}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{localPictures.map((picture) => {
					const slot = getFavoriteSlot(picture);
					const isFavorite = slot !== null;
					const canChoose = !isFavorite && favCount < 2;

					return (
						<div key={picture.id} className="relative">
							{/* Favorite badge */}
							{isFavorite && (
								<div className="absolute -top-3 -right-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
									⭐ {t.favorite(slot!)}
								</div>
							)}

							<PolaroidCard
								imageUrl={picture.signedUrl}
								label={picture.filename}
								id={picture.id.toString()}
								onClick={() => setSelectedPicture(picture)}
							/>

							{/* Favorite button */}
							<div className="mt-2 text-center">
								{canChoose && (
									<button
										onClick={() => setConfirmPicture(picture)}
										className="text-sm font-body text-amber-700 hover:text-amber-800 font-semibold bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
									>
										⭐ {t.chooseFavorite}
									</button>
								)}
								{!isFavorite && favCount >= 2 && (
									<p className="text-xs text-neutral-400 font-body">
										{t.favoriteSlotsFull}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Image modal */}
			{selectedPicture && (
				<PictureModal
					imageUrl={selectedPicture.signedUrl}
					filename={selectedPicture.filename}
					takenAt={selectedPicture.taken_at}
					metadata={selectedPicture.metadata}
					isOpen={!!selectedPicture}
					onClose={() => setSelectedPicture(null)}
				/>
			)}

			{/* Confirmation modal */}
			{confirmPicture && (
				<ConfirmFavoriteModal
					isOpen={!!confirmPicture}
					loading={choosing}
					onConfirm={() => handleChooseFavorite(confirmPicture)}
					onCancel={() => setConfirmPicture(null)}
				/>
			)}
		</>
	);
}
