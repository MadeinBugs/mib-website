'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import GalleryPictureModal from './GalleryPictureModal';
import type { AllPictureData } from './GalleryPageClient';
import { usePictureContestLocale } from './PictureContestLocaleContext';

function LazyPicture({
	pic,
	onClick,
}: {
	pic: AllPictureData;
	onClick: () => void;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '300px' }
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<button
			ref={ref}
			onClick={onClick}
			className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04c597] focus:ring-offset-2"
		>
			{shouldLoad && pic.imageUrl ? (
				<Image
					src={pic.imageUrl}
					alt={`Photo ${pic.id}`}
					fill
					className="object-cover transition-transform duration-200 group-hover:scale-105"
					sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
				/>
			) : (
				<div className="w-full h-full bg-neutral-200 animate-pulse" />
			)}
			{pic.isFavorite && (
				<div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
					⭐
				</div>
			)}
		</button>
	);
}

export default function AllPicturesGrid({
	pictures,
	locale,
}: {
	pictures: AllPictureData[];
	locale: string;
}) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const { t } = usePictureContestLocale();

	// Horizontal scroll with mouse wheel
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const handler = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				e.preventDefault();
				el.scrollLeft += e.deltaY;
			}
		};

		el.addEventListener('wheel', handler, { passive: false });
		return () => el.removeEventListener('wheel', handler);
	}, []);

	if (pictures.length === 0) {
		return (
			<p className="text-neutral-500 font-body text-lg text-center py-20">
				{locale === 'en' ? 'No pictures yet' : 'Nenhuma foto ainda'}
			</p>
		);
	}

	const selectedPicture = selectedIndex !== null ? pictures[selectedIndex] : null;

	return (
		<>
			{/* Counter */}
			<p className="text-sm text-neutral-500 font-body mb-3">
				{t.picturesCount(pictures.length)}
			</p>

			<div
				ref={scrollRef}
				className="overflow-x-auto pb-4"
				style={{ scrollbarWidth: 'thin' }}
			>
				<div
					className="grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] md:auto-cols-[280px] gap-3"
					style={{ gridTemplateRows: 'repeat(2, 1fr)' }}
				>
					{pictures.map((pic, index) => (
						<LazyPicture
							key={pic.id}
							pic={pic}
							onClick={() => setSelectedIndex(index)}
						/>
					))}
				</div>
			</div>

			{selectedPicture && selectedIndex !== null && (
				<GalleryPictureModal
					picture={selectedPicture}
					currentIndex={selectedIndex}
					totalCount={pictures.length}
					onClose={() => setSelectedIndex(null)}
					onPrev={() => setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
					onNext={() => setSelectedIndex((i) => (i !== null && i < pictures.length - 1 ? i + 1 : i))}
				/>
			)}
		</>
	);
}
