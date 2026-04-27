'use client';

import { useEffect, useRef } from 'react';
import 'lite-youtube-embed/src/lite-yt-embed.css';

interface LiteYouTubeProps {
	videoId: string;
	title: string;
}

export default function LiteYouTube({ videoId, title }: LiteYouTubeProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		import('lite-youtube-embed');
	}, []);

	return (
		<div ref={containerRef} className="w-full h-full [&>lite-youtube]:w-full [&>lite-youtube]:h-full [&>lite-youtube]:max-width-none">
			{/* @ts-expect-error - lite-youtube is a custom element */}
			<lite-youtube videoid={videoId} playlabel={title} />
		</div>
	);
}
