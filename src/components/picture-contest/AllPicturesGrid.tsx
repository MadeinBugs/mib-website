'use client';

import { useState } from 'react';
import Image from 'next/image';
import GalleryPictureModal from './GalleryPictureModal';
import type { AllPictureData } from './GalleryPageClient';

export default function AllPicturesGrid({
	pictures,
	locale,
}: {
	pictures: AllPictureData[];
	locale: string;
}) {
	const [selectedPicture, setSelectedPicture] = useState<AllPictureData | null>(null);

	if (pictures.length === 0) {
		return (
			<p className="text-neutral-500 font-body text-lg text-center py-20">
				{locale === 'en' ? 'No pictures yet' : 'Nenhuma foto ainda'}
			</p>
		);
	}

	return (
		<>
			<div
				className="overflow-x-auto pb-4"
				style={{
					/* Hide scrollbar on webkit but keep scrolling */
					scrollbarWidth: 'thin',
				}}
			>
				<div
					className="grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] md:auto-cols-[280px] gap-3"
					style={{ gridTemplateRows: 'repeat(2, 1fr)' }}
				>
					{pictures.map((pic) => (
						<button
							key={pic.id}
							onClick={() => setSelectedPicture(pic)}
							className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04c597] focus:ring-offset-2"
						>
							{pic.imageUrl ? (
								<Image
									src={pic.imageUrl}
									alt={`Photo ${pic.id}`}
									fill
									className="object-cover transition-transform duration-200 group-hover:scale-105"
									loading="lazy"
									sizes="280px"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<span className="text-neutral-400 text-3xl">📷</span>
								</div>
							)}
							{pic.isFavorite && (
								<div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
									⭐
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{selectedPicture && (
				<GalleryPictureModal
					picture={selectedPicture}
					onClose={() => setSelectedPicture(null)}
				/>
			)}
		</>
	);
}
