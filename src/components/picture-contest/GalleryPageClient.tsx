'use client';

import { useState } from 'react';
import AdminGallery from './AdminGallery';
import AllPicturesGrid from './AllPicturesGrid';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface AdminSessionData {
	unique_id: string;
	created_at: string;
	machine_id: string;
	game_version: string;
	pictureCount: number;
	favoriteCount: number;
	previewUrl: string | null;
}

export interface AllPictureData {
	id: number;
	imageUrl: string | null;
	sessionId: string;
	isFavorite: boolean;
}

type ViewMode = 'sessions' | 'all';

export default function GalleryPageClient({
	sessionData,
	allPictures,
	locale,
}: {
	sessionData: AdminSessionData[];
	allPictures: AllPictureData[];
	locale: string;
}) {
	const [view, setView] = useState<ViewMode>('sessions');
	const { t } = usePictureContestLocale();

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div
					role="heading"
					aria-level={1}
					style={{
						fontFamily: "'Amatic SC', cursive",
						fontSize: 'clamp(3rem, 4vw + 1rem, 4rem)',
						fontWeight: 700,
						color: '#04c597',
						textShadow: '-1px 1px 0px #016a50',
					}}
				>
					{locale === 'en' ? 'Gallery' : 'Galeria'}
				</div>
				<a
					href={`/${locale}/picture-contest/logout`}
					className="text-sm font-body text-[#04c597] hover:text-[#36c8ab] font-semibold transition-colors"
				>
					{locale === 'en' ? 'Sign out' : 'Sair'}
				</a>
			</div>

			{/* View toggle */}
			<div className="flex gap-2 mb-6">
				<button
					onClick={() => setView('sessions')}
					className={`px-4 py-2 rounded-full text-sm font-body font-semibold transition-colors ${view === 'sessions'
							? 'bg-[#04c597] text-white'
							: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
						}`}
				>
					{t.galleryViewSessions}
				</button>
				<button
					onClick={() => setView('all')}
					className={`px-4 py-2 rounded-full text-sm font-body font-semibold transition-colors ${view === 'all'
							? 'bg-[#04c597] text-white'
							: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
						}`}
				>
					{t.galleryViewAll} ({allPictures.length})
				</button>
			</div>

			{/* Content */}
			{view === 'sessions' ? (
				<AdminGallery sessions={sessionData} locale={locale} />
			) : (
				<AllPicturesGrid pictures={allPictures} locale={locale} />
			)}
		</div>
	);
}
