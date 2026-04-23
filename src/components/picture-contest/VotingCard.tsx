'use client';

import PolaroidCard from './PolaroidCard';
import type { VotingPhoto } from '@/lib/contest/voting-algorithm';
import { usePictureContestLocale } from './PictureContestLocaleContext';

interface VotingCardProps {
	photo: VotingPhoto;
	isVoted: boolean;
	voteCount: number;
	isPending: boolean;
	isActive: boolean;
	onToggleVote: () => void;
}

export default function VotingCard({
	photo,
	isVoted,
	voteCount,
	isPending,
	isActive,
	onToggleVote,
}: VotingCardProps) {
	const { t } = usePictureContestLocale();

	return (
		<div className="relative">
			<PolaroidCard
				imageUrl={photo.imageUrl}
				label=""
				id={photo.id.toString()}
				onClick={isActive ? onToggleVote : undefined}
				overlay={
					<>
						{/* Vote star (bottom-right) */}
						<div
							className={`group/star absolute bottom-0 -right-4 z-20 flex items-center ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
							onClick={(e) => {
								e.stopPropagation();
								if (isActive) onToggleVote();
							}}
						>
							{/* Vote count */}
							<span
								className="text-sm font-body font-bold mr-1 transition-colors duration-200"
								style={{ color: isVoted ? '#FFBD43' : '#999' }}
							>
								{voteCount}
							</span>

							{/* Star icon */}
							<div className={`transition-transform duration-300 ease-out ${isActive ? 'group-hover/star:scale-110' : ''} ${isPending ? 'animate-pulse' : ''}`}>
								{isVoted ? (
									<svg width="40" height="40" viewBox="0 0 24 24" fill="#FFBD43" className="drop-shadow-lg">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								) : (
									<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" className={`drop-shadow-lg ${isActive ? 'group-hover/star:stroke-[#FFBD43]' : ''} transition-colors duration-200`}>
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								)}
							</div>
						</div>
					</>
				}
			/>
		</div>
	);
}
