'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { AllPictureData } from './GalleryPageClient';
import { usePictureContestLocale } from './PictureContestLocaleContext';

const POLAROID_PADDING_TOP = 24;
const POLAROID_PADDING_SIDE = 24;
const POLAROID_PADDING_BOTTOM = 100;

export default function GalleryPictureModal({
	picture,
	onClose,
}: {
	picture: AllPictureData;
	onClose: () => void;
}) {
	const { t } = usePictureContestLocale();
	const backdropRef = useRef<HTMLDivElement>(null);

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [onClose]);

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

			const canvasWidth = img.naturalWidth + POLAROID_PADDING_SIDE * 2;
			const canvasHeight = img.naturalHeight + POLAROID_PADDING_TOP + POLAROID_PADDING_BOTTOM;

			const canvas = document.createElement('canvas');
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// White background (polaroid frame)
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			// Draw the photo
			ctx.drawImage(img, POLAROID_PADDING_SIDE, POLAROID_PADDING_TOP);

			// Session label text in the bottom area
			ctx.fillStyle = '#525252';
			ctx.font = `${Math.max(24, Math.round(img.naturalWidth * 0.03))}px Pangolin, cursive, sans-serif`;
			ctx.textAlign = 'center';
			ctx.fillText(
				picture.sessionId,
				canvasWidth / 2,
				img.naturalHeight + POLAROID_PADDING_TOP + POLAROID_PADDING_BOTTOM * 0.6
			);

			canvas.toBlob((blob) => {
				if (!blob) return;
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
	}, [picture.imageUrl, picture.id, picture.sessionId]);

	return (
		<div
			ref={backdropRef}
			onClick={handleBackdropClick}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		>
			<div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-700 flex items-center justify-center text-xl font-bold shadow-lg transition-colors"
					aria-label="Close"
				>
					×
				</button>

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

				{/* Session ID badge */}
				<p className="mt-3 text-sm text-neutral-400 font-body">
					{t.booth}: {picture.sessionId}
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
