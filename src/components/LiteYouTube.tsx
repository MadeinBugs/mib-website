'use client';

import { useEffect } from 'react';
import 'lite-youtube-embed/src/lite-yt-embed.css';

interface LiteYouTubeProps {
	videoId: string;
	title: string;
}

export default function LiteYouTube({ videoId, title }: LiteYouTubeProps) {
	useEffect(() => {
		import('lite-youtube-embed');
	}, []);

	return (
		<div className="w-full h-full [&>lite-youtube]:w-full [&>lite-youtube]:h-full [&>lite-youtube]:max-w-none">
			<lite-youtube videoid={videoId} playlabel={title} />
		</div>
	);
}
