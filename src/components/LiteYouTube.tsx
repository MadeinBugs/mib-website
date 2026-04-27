'use client';

import { useEffect } from 'react';
import 'lite-youtube-embed/src/lite-yt-embed.css';

interface LiteYouTubeProps {
	videoId: string;
	title: string;
	priority?: boolean;
}

export default function LiteYouTube({ videoId, title, priority }: LiteYouTubeProps) {
	useEffect(() => {
		import('lite-youtube-embed');
	}, []);

	const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

	return (
		<div className="w-full h-full [&>lite-youtube]:w-full [&>lite-youtube]:h-full [&>lite-youtube]:max-w-none">
			{priority && (
				<link rel="preload" as="image" href={posterUrl} fetchPriority="high" />
			)}
			<lite-youtube videoid={videoId} playlabel={title} />
		</div>
	);
}
