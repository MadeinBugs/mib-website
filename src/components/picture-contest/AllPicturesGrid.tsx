'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import GalleryPictureModal from './GalleryPictureModal';
import type { AllPictureData } from './GalleryPageClient';
import { usePictureContestLocale } from './PictureContestLocaleContext';

function getRotation(id: number): number {
	const hash = String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
	return (hash % 7) - 3; // -3 to +3
}

function LazyPolaroid({
	pic,
	onClick,
}: {
	pic: AllPictureData;
	onClick: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const rotation = getRotation(pic.id);

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
		<div
			ref={ref}
			onClick={onClick}
			className="group cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:z-10 relative"
			style={{ transform: `rotate(${rotation}deg)` }}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = `rotate(${rotation}deg)`;
			}}
		>
			{pic.isFavorite && (
				<div className="absolute top-1 right-1 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
					⭐
				</div>
			)}
			<div
				className="bg-white shadow-md group-hover:shadow-xl transition-shadow duration-300"
				style={{
					padding: '8px 8px 40px 8px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
				}}
			>
				<div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
					{shouldLoad && pic.imageUrl ? (
						<Image
							src={pic.imageUrl}
							alt={`Photo ${pic.id}`}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
						/>
					) : (
						<div className="w-full h-full bg-neutral-200 animate-pulse" />
					)}
				</div>
				<p
					className="text-center text-neutral-600 mt-2 truncate"
					style={{ fontFamily: "'Pangolin', cursive", fontSize: '0.75rem' }}
				>
					{pic.sessionId}
				</p>
			</div>
		</div>
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
					className="grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] md:auto-cols-[280px] gap-6"
					style={{ gridTemplateRows: 'repeat(2, 1fr)', padding: '8px' }}
				>
					{pictures.map((pic, index) => (
						<LazyPolaroid
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
