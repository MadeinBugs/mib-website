'use client';

import { useState } from 'react';
import PolaroidCard from './PolaroidCard';
import PictureModal from './PictureModal';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface PictureData {
	id: number;
	filename: string;
	signedUrl: string;
	picture_index: number;
	taken_at: string | null;
	metadata: Record<string, unknown> | null;
}

export default function PictureGallery({ pictures }: { pictures: PictureData[] }) {
	const { t } = usePictureContestLocale();
	const [selectedPicture, setSelectedPicture] = useState<PictureData | null>(null);

	if (pictures.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-neutral-500 font-body text-lg">{t.noPictures}</p>
			</div>
		);
	}

	return (
		<>
			<p className="text-sm text-neutral-500 font-body mb-6">
				{t.picturesCount(pictures.length)}
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{pictures.map((picture) => (
					<PolaroidCard
						key={picture.id}
						imageUrl={picture.signedUrl}
						label={picture.filename}
						id={picture.id.toString()}
						onClick={() => setSelectedPicture(picture)}
					/>
				))}
			</div>

			{selectedPicture && (
				<PictureModal
					imageUrl={selectedPicture.signedUrl}
					filename={selectedPicture.filename}
					takenAt={selectedPicture.taken_at}
					metadata={selectedPicture.metadata}
					isOpen={!!selectedPicture}
					onClose={() => setSelectedPicture(null)}
				/>
			)}
		</>
	);
}
