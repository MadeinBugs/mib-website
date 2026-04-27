'use client';

import Link from 'next/link';
import PolaroidCard from './PolaroidCard';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface SessionCardData {
	unique_id: string;
	created_at: string;
	machine_id: string;
	pictureCount: number;
	previewUrl: string | null;
}

export default function SessionCard({ session, locale }: { session: SessionCardData; locale: string }) {
	const { t } = usePictureContestLocale();
	const date = new Date(session.created_at);
	const formattedDate = date.toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<Link href={`/${locale}/picture-contest/${session.unique_id}`}>
			<div className="group">
				{session.previewUrl ? (
					<PolaroidCard
						imageUrl={session.previewUrl}
						label={session.unique_id}
						id={session.unique_id}
					/>
				) : (
					<div
						className="bg-white shadow-md transition-shadow duration-300 group-hover:shadow-xl"
						style={{
							padding: '12px 12px 60px 12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
						}}
					>
						<div className="w-full aspect-[4/3] bg-neutral-200 flex items-center justify-center">
							<span className="text-neutral-400 text-4xl">📷</span>
						</div>
						<p
							className="text-center text-neutral-600 mt-3"
							style={{
								fontFamily: "var(--font-pangolin), cursive",
								fontSize: '0.85rem',
							}}
						>
							{session.unique_id}
						</p>
					</div>
				)}
				{/* Session info overlay */}
				<div className="mt-2 text-center space-y-0.5">
					<p className="text-xs text-neutral-500 font-body">{formattedDate}</p>
					<p className="text-xs text-neutral-400 font-body">
						{t.booth}: {session.machine_id} &middot; {t.picturesCount(session.pictureCount)}
					</p>
				</div>
			</div>
		</Link>
	);
}
