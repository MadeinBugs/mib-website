'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { AllPictureData } from './GalleryPageClient';
import { usePictureContestLocale } from './PictureContestLocaleContext';

const POLAROID_PADDING_TOP = 0.04;    // 4% of image height
const POLAROID_PADDING_SIDE = 0.04;   // 4% of image width
const POLAROID_PADDING_BOTTOM = 0.15; // 15% of image height

export default function GalleryPictureModal({
	picture,
	currentIndex,
	totalCount,
	onClose,
	onPrev,
	onNext,
}: {
	picture: AllPictureData;
	currentIndex: number;
	totalCount: number;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
}) {
	const { t } = usePictureContestLocale();
	const backdropRef = useRef<HTMLDivElement>(null);

	// Keyboard: Escape, ArrowLeft, ArrowRight
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowLeft') onPrev();
			if (e.key === 'ArrowRight') onNext();
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [onClose, onPrev, onNext]);

	// Prevent body scroll while modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === backdropRef.current) onClose();
	};

	const downloadPicture = useCallback(async () => {
		if (!picture.imageUrl) return;
		try {
			const res = await fetch(picture.imageUrl);
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `photo-${picture.id}.jpg`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			window.open(picture.imageUrl, '_blank');
		}
	}, [picture.imageUrl, picture.id]);

	const downloadPolaroid = useCallback(async () => {
		if (!picture.imageUrl) return;
		try {
			const img = new window.Image();
			img.crossOrigin = 'anonymous';
			img.src = picture.imageUrl;
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error('Failed to load image'));
			});

			const padTop = Math.round(img.naturalHeight * POLAROID_PADDING_TOP);
			const padSide = Math.round(img.naturalWidth * POLAROID_PADDING_SIDE);
			const padBottom = Math.round(img.naturalHeight * POLAROID_PADDING_BOTTOM);

			const canvasWidth = img.naturalWidth + padSide * 2;
			const canvasHeight = img.naturalHeight + padTop + padBottom;

			const canvas = document.createElement('canvas');
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// White background (polaroid frame)
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			// Draw the photo
			ctx.drawImage(img, padSide, padTop);

			canvas.toBlob((blob) => {
				if (!blob) {
					// CORS tainted canvas — fallback to opening original image
					window.open(picture.imageUrl!, '_blank');
					return;
				}
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `polaroid-${picture.id}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}, 'image/png');
		} catch {
			window.open(picture.imageUrl, '_blank');
		}
	}, [picture.imageUrl, picture.id]);

	const hasPrev = currentIndex > 0;
	const hasNext = currentIndex < totalCount - 1;

	return (
		<div
			ref={backdropRef}
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-label="Picture preview"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		>
			<div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-xl font-bold shadow-lg transition-colors"
					aria-label="Close"
				>
					×
				</button>

				{/* Prev / Next arrows */}
				{hasPrev && (
					<button
						onClick={(e) => { e.stopPropagation(); onPrev(); }}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-xl shadow-lg transition-colors"
						aria-label="Previous"
					>
						‹
					</button>
				)}
				{hasNext && (
					<button
						onClick={(e) => { e.stopPropagation(); onNext(); }}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-xl shadow-lg transition-colors"
						aria-label="Next"
					>
						›
					</button>
				)}

				{/* Image */}
				<div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
					{picture.imageUrl ? (
						<Image
							src={picture.imageUrl}
							alt={`Photo ${picture.id}`}
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, 800px"
							priority
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<span className="text-neutral-500 text-5xl">📷</span>
						</div>
					)}
				</div>

				{/* Counter + Session ID */}
				<p className="mt-3 text-sm text-neutral-400 font-body">
					{currentIndex + 1} / {totalCount} — {t.booth}: {picture.sessionId}
					{picture.isFavorite && <span className="ml-2">⭐</span>}
				</p>

				{/* Download buttons */}
				<div className="flex gap-3 mt-4">
					<button
						onClick={downloadPicture}
						className="px-5 py-2.5 rounded-lg bg-white text-neutral-800 font-body font-semibold text-sm hover:bg-neutral-100 transition-colors shadow-md"
					>
						{t.downloadPicture}
					</button>
					<button
						onClick={downloadPolaroid}
						className="px-5 py-2.5 rounded-lg bg-[#04c597] text-white font-body font-semibold text-sm hover:bg-[#03a880] transition-colors shadow-md"
					>
						{t.downloadPolaroid}
					</button>
				</div>
			</div>
		</div>
	);
}
