'use client';

import { useRef, useEffect, useState } from 'react';

interface LazyVideoProps {
	webm: string;
	mp4: string;
	poster: string;
	ariaLabel: string;
	className?: string;
	onClick?: () => void;
}

export default function LazyVideo({ webm, mp4, poster, ariaLabel, className, onClick }: LazyVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
				if (entry.isIntersecting) {
					video.play().catch(() => { });
				} else {
					video.pause();
				}
			},
			{ threshold: 0.25 }
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	return onClick ? (
		<button
			onClick={onClick}
			className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group w-full"
		>
			<video
				ref={videoRef}
				loop
				muted
				playsInline
				preload="metadata"
				poster={poster}
				className={className || 'absolute inset-0 w-full h-full object-cover'}
				aria-label={ariaLabel}
			>
				<source src={webm} type="video/webm" />
				<source src={mp4} type="video/mp4" />
			</video>
			{/* Hover overlay — same as image buttons */}
			<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
				<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
					<svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
					</svg>
				</div>
			</div>
		</button>
	) : (
		<video
			ref={videoRef}
			loop
			muted
			playsInline
			preload="metadata"
			poster={poster}
			className={className || 'absolute inset-0 w-full h-full object-cover'}
			aria-label={ariaLabel}
		>
			<source src={webm} type="video/webm" />
			<source src={mp4} type="video/mp4" />
		</video>
	);
}
