'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getImagePath } from '../lib/imagePaths';

interface ProjectImageVisualizationProps {
	imageSrc: string;
	imageCaption?: string; // Localized caption text
	isOpen: boolean;
	onClose: () => void;
}

export default function ProjectImageVisualization({
	imageSrc,
	imageCaption,
	isOpen,
	onClose
}: ProjectImageVisualizationProps) {
	const [imageLoaded, setImageLoaded] = useState(false);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	// Reset image loaded state when image changes
	useEffect(() => {
		setImageLoaded(false);
	}, [imageSrc]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-50 flex items-center justify-center p-8"
					onClick={onClose}
				>
					{/* Translucent black background */}
					<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

					{/* Close button */}
					<motion.button
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.2, delay: 0.1 }}
						onClick={onClose}
						className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200 text-2xl font-bold leading-none"
						aria-label="Close image viewer"
					>
						×
					</motion.button>

					{/* Image container */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						transition={{
							duration: 0.4,
							ease: [0.16, 1, 0.3, 1] // Custom easing for smooth feel
						}}
						className="relative flex items-center justify-center max-w-full max-h-full"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Loading spinner */}
						{!imageLoaded && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
							</div>
						)}

						{/* Main image */}
						<Image
							src={getImagePath(imageSrc)}
							alt={imageCaption || "Project image"}
							width={1200}
							height={800}
							className={`
								max-w-[70vw] max-h-[65vh] w-auto h-auto object-contain
								shadow-2xl rounded-lg transition-opacity duration-300
								${imageLoaded ? 'opacity-100' : 'opacity-0'}
							`}
							onLoad={() => setImageLoaded(true)}
							unoptimized={imageSrc.endsWith('.gif')}
							priority
						/>

						{/* Image caption */}
						{imageLoaded && imageCaption && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: 0.3 }}
								className="absolute bottom-0 left-0 right-0 p-6 pb-4 bg-gradient-to-t from-black/85 via-black/60 via-black/40 to-transparent rounded-b-lg"
							>
								<p className="text-white text-center font-medium drop-shadow-2xl">
									{imageCaption}
								</p>
							</motion.div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
