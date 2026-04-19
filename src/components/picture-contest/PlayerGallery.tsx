'use client';

import { useState } from 'react';
import PolaroidCard from './PolaroidCard';
import PictureModal from './PictureModal';
import ConfirmFavoriteModal from './ConfirmFavoriteModal';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface PictureData {
	id: number;
	filename: string;
	signedUrl: string | null;
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
	const [successPictureId, setSuccessPictureId] = useState<number | null>(null);

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
			setSuccessPictureId(picture.id);
			setTimeout(() => setSuccessPictureId(null), 3000);
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
				<div role="heading" aria-level={1} className="text-center sm:text-left" style={{ fontFamily: "'Amatic SC', cursive", fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 700, color: '#04c597', textShadow: '-1px 1px 0px #016a50' }}>
					{t.playerGalleryTitle(uniqueId)}
				</div>
				<p className="text-sm text-neutral-500 font-body mt-2">
					{t.picturesCount(localPictures.length)}
				</p>
				<p className="text-sm text-neutral-600 font-body mt-1">
					{t.favoritedCountText(favCount, 2 - favCount)}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{localPictures.map((picture) => {
					const slot = getFavoriteSlot(picture);
					const isFavorite = slot !== null;
					const canChoose = !isFavorite && favCount < 2;

					return (
						<div key={picture.id} className="relative">
							<PolaroidCard
								imageUrl={picture.signedUrl}
								label={picture.filename}
								id={picture.id.toString()}
								onClick={() => setSelectedPicture(picture)}
								overlay={
									<>
										{/* Heart sticker for favorites (top-left) */}
										{isFavorite && (
											<img
												src="/assets/picture-contest/heart.png"
												alt=""
												width={64}
												height={64}
												className="absolute -top-6 -left-6 z-20 drop-shadow-lg pointer-events-none"
											/>
										)}

										{/* "Already favorited" label for favorites (bottom-right) */}
										{isFavorite && (
											<span className="absolute bottom-1 right-1 z-20 whitespace-nowrap text-sm font-body font-bold text-[#ed7171] pointer-events-none">
												{t.alreadyFavorited}
											</span>
										)}

										{/* Star sticker button (bottom-right) */}
										{canChoose && (
											<div
												className="group/star absolute bottom-0 -right-4 z-20 flex items-center cursor-pointer"
												onClick={(e) => { e.stopPropagation(); setConfirmPicture(picture); }}
											>
												<span className="whitespace-nowrap text-sm font-body font-bold text-[#FFBD43] opacity-0 group-hover/star:opacity-100 transition-opacity duration-300 ease-out mr-1">
													{t.favoriteLabel}
												</span>
												<img
													src="/assets/picture-contest/star.png"
													alt={t.favoriteLabel}
													width={64}
													height={64}
													className="transition-transform duration-500 ease-out group-hover/star:rotate-[180deg] drop-shadow-lg"
												/>
											</div>
										)}
									</>
								}
							/>

							{/* Success toast */}
							{successPictureId === picture.id && (
								<p className="text-xs text-green-600 font-body font-semibold animate-pulse mt-2 text-center">
									{t.favoriteSuccess}
								</p>
							)}
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
