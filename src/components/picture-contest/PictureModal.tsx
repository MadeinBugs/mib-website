'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface PictureModalProps {
	imageUrl: string;
	filename: string;
	takenAt: string | null;
	metadata: Record<string, unknown> | null;
	isOpen: boolean;
	onClose: () => void;
}

function formatMetadataValue(value: unknown): string {
	if (value === null || value === undefined) return '—';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (Array.isArray(value)) return value.map(formatMetadataValue).join(', ');
	if (typeof value === 'object') return JSON.stringify(value, null, 2);
	return String(value);
}

function formatMetadataKey(key: string): string {
	return key
		.replace(/_/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^\w/, (c) => c.toUpperCase());
}

export default function PictureModal({
	imageUrl,
	filename,
	takenAt,
	metadata,
	isOpen,
	onClose,
}: PictureModalProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const { t, locale } = usePictureContestLocale();

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		setImageLoaded(false);
	}, [imageUrl]);

	const formattedDate = takenAt
		? new Date(takenAt).toLocaleString(locale === 'en' ? 'en-US' : 'pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
		: null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
					onClick={onClose}
				>
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

					{/* Close button */}
					<motion.button
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.2, delay: 0.1 }}
						onClick={onClose}
						className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 text-2xl font-bold leading-none"
						aria-label="Close"
					>
						&times;
					</motion.button>

					{/* Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="relative flex flex-col max-w-5xl max-h-[90vh] w-full overflow-y-auto rounded-lg bg-neutral-900"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Image */}
						<div className="relative w-full flex items-center justify-center bg-black min-h-[300px]">
							{!imageLoaded && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
								</div>
							)}
							<Image
								src={imageUrl}
								alt={filename}
								width={1920}
								height={1080}
								className={`max-w-full max-h-[60vh] w-auto h-auto object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
									}`}
								onLoad={() => setImageLoaded(true)}
								priority
							/>
						</div>

						{/* Info panel */}
						<div className="p-6 space-y-4">
							{/* Filename & date */}
							<div>
								<p className="text-white font-body text-sm font-mono">{filename}</p>
								{formattedDate && (
									<p className="text-neutral-400 text-xs font-body mt-1">
										{t.takenAt} {formattedDate}
									</p>
								)}
							</div>

							{/* Metadata */}
							{metadata && Object.keys(metadata).length > 0 && (
								<div>
									<h3 className="text-amber-400 font-h2 text-sm font-bold mb-2">
										{t.metadata}
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{Object.entries(metadata).map(([key, value]) => (
											<div
												key={key}
												className="bg-neutral-800 rounded px-3 py-2"
											>
												<span className="text-neutral-400 text-xs font-body">
													{formatMetadataKey(key)}
												</span>
												<p className="text-white text-sm font-body mt-0.5 break-words">
													{formatMetadataValue(value)}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
