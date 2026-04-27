'use client';

import Link from 'next/link';
import PolaroidCard from './PolaroidCard';
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

export default function AdminGallery({
	sessions,
	locale,
}: {
	sessions: AdminSessionData[];
	locale: string;
}) {
	const { t } = usePictureContestLocale();

	if (sessions.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-neutral-500 font-body text-lg">{t.noSessions}</p>
			</div>
		);
	}

	return (
		<div>
			<p className="text-sm text-neutral-500 font-body mb-6">
				{t.sessionsCount(sessions.length)}
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{sessions.map((session) => {
					const date = new Date(session.created_at);
					const formattedDate = date.toLocaleDateString(
						locale === 'en' ? 'en-US' : 'pt-BR',
						{ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
					);

					return (
						<Link
							key={session.unique_id}
							href={`/${locale}/picture-contest/${session.unique_id}`}
						>
							<div className="group">
								{session.previewUrl ? (
									<PolaroidCard
										imageUrl={session.previewUrl}
										label={session.unique_id}
										id={session.unique_id}
									/>
								) : (
									<div
										className="bg-white shadow-md"
										style={{ padding: '12px 12px 60px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
									>
										<div className="w-full aspect-[4/3] bg-neutral-200 flex items-center justify-center">
											<span className="text-neutral-400 text-4xl">📷</span>
										</div>
										<p className="text-center text-neutral-600 mt-3" style={{ fontFamily: "var(--font-pangolin), cursive", fontSize: '0.85rem' }}>
											{session.unique_id}
										</p>
									</div>
								)}

								{/* Session info */}
								<div className="mt-2 text-center space-y-0.5">
									<p className="text-xs text-neutral-500 font-body">{formattedDate}</p>
									<p className="text-xs text-neutral-400 font-body">
										{t.booth}: {session.machine_id} &middot; {t.picturesCount(session.pictureCount)}
									</p>
									{session.favoriteCount > 0 && (
										<p className="text-xs text-amber-600 font-body font-semibold">
											⭐ {session.favoriteCount} {locale === 'en' ? 'favorites' : 'favoritas'}
										</p>
									)}
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
