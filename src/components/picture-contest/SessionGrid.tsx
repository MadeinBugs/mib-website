'use client';

import SessionCard from './SessionCard';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface SessionData {
	unique_id: string;
	created_at: string;
	machine_id: string;
	pictureCount: number;
	previewUrl: string | null;
}

export default function SessionGrid({
	sessions,
	locale,
}: {
	sessions: SessionData[];
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
				{sessions.map((session) => (
					<SessionCard key={session.unique_id} session={session} locale={locale} />
				))}
			</div>
		</div>
	);
}
