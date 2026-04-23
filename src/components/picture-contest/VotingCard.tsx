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

/** Adjust this to control how much each stacked heart overlaps the previous one (in px) */
const HEART_OVERLAP_PX = 12;

function getHeartCount(votes: number): number {
	if (votes >= 31) return 4;
	if (votes >= 11) return 3;
	if (votes >= 4) return 2;
	return 1;
}

/** How much size shrinks per step back from the front heart (in px) */
const HEART_SIZE_STEP = 4;
/** How much saturation drops per step back (0–1, where 1 = full red) */
const HEART_SATURATION_STEP = 0.18;

function HeartStack({ count }: { count: number }) {
	const maxSize = 32;
	return (
		<span className="relative inline-flex items-center" style={{ width: maxSize + (count - 1) * HEART_OVERLAP_PX, height: maxSize + 2 }}>
			{Array.from({ length: count }, (_, i) => {
				const stepsFromFront = count - 1 - i;
				const size = maxSize - stepsFromFront * HEART_SIZE_STEP;
				const saturation = 1 - stepsFromFront * HEART_SATURATION_STEP;
				// Interpolate from grey (#999) at sat=0 to red (#ef4444) at sat=1
				const r = Math.round(153 + (239 - 153) * saturation);
				const g = Math.round(153 + (68 - 153) * saturation);
				const b = Math.round(153 + (68 - 153) * saturation);
				return (
					<svg
						key={i}
						width={size}
						height={size}
						viewBox="0 0 24 24"
						fill={`rgb(${r},${g},${b})`}
						className="absolute"
						style={{ left: i * HEART_OVERLAP_PX, bottom: 0, zIndex: i }}
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				);
			})}
		</span>
	);
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
	const heartCount = getHeartCount(voteCount);

	return (
		<div className="relative">
			<PolaroidCard
				imageUrl={photo.imageUrl}
				label=""
				id={photo.id.toString()}
				onClick={isActive ? onToggleVote : undefined}
				overlay={
					<>
						{/* Vote count with hearts (top-left) */}
						<div className="absolute -top-3 -left-2 z-20 flex items-center gap-1.5 pointer-events-none">
							{voteCount > 0 ? (
								<>
									<HeartStack count={heartCount} />
									<span
										className="text-sm font-body font-bold whitespace-nowrap"
										style={{ color: '#ef4444' }}
									>
										{t.votesCount(voteCount)}
									</span>
								</>
							) : (
								<span
									className="text-sm font-body font-bold whitespace-nowrap"
									style={{ color: '#04c597' }}
								>
									{t.newLabel}
								</span>
							)}
						</div>

						{/* Vote star (bottom-right) */}
						<div
							className={`group/star absolute bottom-0 -right-4 z-20 flex items-center ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
							onClick={(e) => {
								e.stopPropagation();
								if (isActive) onToggleVote();
							}}
						>
							{/* "Already voted!" text when voted */}
							{isVoted && (
								<span
									className="text-xs font-body font-bold mr-1 whitespace-nowrap"
									style={{ color: '#FFBD43' }}
								>
									{t.alreadyVoted}
								</span>
							)}

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
