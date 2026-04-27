'use client';

import { useState, useEffect } from 'react';
import VotingCard from './VotingCard';
import VotingToaster from './VotingToaster';
import { PictureContestLocaleProvider } from './PictureContestLocaleContext';
import { usePictureContestLocale } from './PictureContestLocaleContext';
import { toastVoted, toastUnvoted, toastVoteFailed } from '@/lib/contest/voting-toast';
import type { PictureContestLocale } from '@/lib/pictureContestI18n';
import type { VotingPhoto } from '@/lib/contest/voting-algorithm';

interface VotingPageClientProps {
	photos: VotingPhoto[];
	locale: string;
	isActive: boolean;
	closesAt: string | null;
}

function VotingContent({ photos, isActive, closesAt }: Omit<VotingPageClientProps, 'locale'>) {
	const { t, locale } = usePictureContestLocale();
	const [votedIds, setVotedIds] = useState<Set<number>>(new Set());
	const [hydrated, setHydrated] = useState(false);
	const [voteCounts, setVoteCounts] = useState<Map<number, number>>(
		() => new Map(photos.map((p) => [p.id, p.voteCount]))
	);
	const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
	const [showCaptcha, setShowCaptcha] = useState(false);
	const [pendingVoteId, setPendingVoteId] = useState<number | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem('contest_voted_ids');
			if (stored) {
				setVotedIds(new Set(JSON.parse(stored) as number[]));
			}
		} catch { }
		setHydrated(true);
	}, []);

	async function submitVote(pictureId: number, captchaToken?: string) {
		setPendingIds((s) => new Set(s).add(pictureId));

		try {
			const body: { picture_id: number; hcaptcha_token?: string } = { picture_id: pictureId };
			if (captchaToken) body.hcaptcha_token = captchaToken;

			const res = await fetch('/api/contest/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (res.ok) {
				setVotedIds((s) => {
					const next = new Set(s).add(pictureId);
					localStorage.setItem('contest_voted_ids', JSON.stringify([...next]));
					return next;
				});
				setVoteCounts((m) => {
					const next = new Map(m);
					next.set(pictureId, (next.get(pictureId) ?? 0) + 1);
					return next;
				});
				sessionStorage.setItem('contest_hasVotedBefore', 'true');
				toastVoted(t.toastVoted);
			} else if (res.status === 409) {
				// Already voted — sync local state
				setVotedIds((s) => {
					const next = new Set(s).add(pictureId);
					localStorage.setItem('contest_voted_ids', JSON.stringify([...next]));
					return next;
				});
			} else if (res.status === 400) {
				const data = await res.json();
				if (data.error?.includes('Captcha')) {
					// Need captcha — show it
					setPendingVoteId(pictureId);
					setShowCaptcha(true);
				} else {
					toastVoteFailed(t.toastVoteFailed);
				}
			} else {
				toastVoteFailed(t.toastVoteFailed);
			}
		} catch {
			toastVoteFailed(t.toastVoteFailed);
		} finally {
			setPendingIds((s) => {
				const next = new Set(s);
				next.delete(pictureId);
				return next;
			});
		}
	}

	async function submitUnvote(pictureId: number) {
		setPendingIds((s) => new Set(s).add(pictureId));

		try {
			const res = await fetch('/api/contest/unvote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ picture_id: pictureId }),
			});

			if (res.ok) {
				setVotedIds((s) => {
					const next = new Set(s);
					next.delete(pictureId);
					localStorage.setItem('contest_voted_ids', JSON.stringify([...next]));
					return next;
				});
				setVoteCounts((m) => {
					const next = new Map(m);
					next.set(pictureId, Math.max(0, (next.get(pictureId) ?? 1) - 1));
					return next;
				});
				toastUnvoted(t.toastUnvoted);
			} else {
				toastVoteFailed(t.toastVoteFailed);
			}
		} catch {
			toastVoteFailed(t.toastVoteFailed);
		} finally {
			setPendingIds((s) => {
				const next = new Set(s);
				next.delete(pictureId);
				return next;
			});
		}
	}

	function handleToggleVote(pictureId: number) {
		if (!isActive) return;
		if (pendingIds.has(pictureId)) return;

		if (votedIds.has(pictureId)) {
			submitUnvote(pictureId);
		} else if (
			sessionStorage.getItem('contest_hasVotedBefore') === 'true' ||
			localStorage.getItem('contest_voted_ids') !== null
		) {
			submitVote(pictureId);
		} else {
			// First vote ever — need captcha
			setPendingVoteId(pictureId);
			setShowCaptcha(true);
		}
	}

	function handleCaptchaVerify(token: string) {
		setShowCaptcha(false);
		if (pendingVoteId !== null) {
			submitVote(pendingVoteId, token);
			setPendingVoteId(null);
		}
	}

	if (photos.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-neutral-500 font-body text-lg">
					{t.noPicturesVoting}
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-8">
				<div
					role="heading"
					aria-level={1}
					className="text-center sm:text-left"
					style={{
						fontFamily: "var(--font-amatic), cursive",
						fontSize: 'clamp(3rem, 4vw + 1rem, 4rem)',
						fontWeight: 700,
						color: '#04c597',
						textShadow: '-1px 1px 0px #016a50',
					}}
				>
					{t.votingTitle}
				</div>
				<p className="text-sm text-neutral-500 font-body mt-2">
					{t.votingSubtitle(photos.length)}
				</p>

				{!isActive && (
					<div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
						<p className="text-amber-700 font-body text-sm font-semibold">
							{t.votingClosed}
						</p>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{photos.map((photo) => (
					<VotingCard
						key={photo.id}
						photo={photo}
						isVoted={hydrated ? votedIds.has(photo.id) : false}
						voteCount={voteCounts.get(photo.id) ?? photo.voteCount}
						isPending={pendingIds.has(photo.id)}
						isActive={isActive}
						onToggleVote={() => handleToggleVote(photo.id)}
					/>
				))}
			</div>

			{/* hCaptcha modal */}
			{showCaptcha && (
				<CaptchaModal
					onVerify={handleCaptchaVerify}
					onClose={() => { setShowCaptcha(false); setPendingVoteId(null); }}
				/>
			)}
		</>
	);
}

function CaptchaModal({
	onVerify,
	onClose,
}: {
	onVerify: (token: string) => void;
	onClose: () => void;
}) {
	const { t } = usePictureContestLocale();
	const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '';

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<div
				className="relative bg-[#f7fff0] rounded-crayon border-2 border-[#1e6259] shadow-xl p-6 max-w-sm w-full"
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className="text-center mb-2"
					style={{
						fontFamily: "var(--font-amatic), cursive",
						fontSize: 'clamp(1.5rem, 3vw, 2rem)',
						fontWeight: 700,
						color: '#04c597',
					}}
				>
					{t.captchaTitle}
				</div>
				<p className="text-center text-neutral-600 font-body text-sm mb-4">
					{t.captchaSubtitle}
				</p>
				<div className="flex justify-center">
					<HCaptchaWrapper siteKey={siteKey} onVerify={onVerify} />
				</div>
			</div>
		</div>
	);
}

function HCaptchaWrapper({
	siteKey,
	onVerify,
}: {
	siteKey: string;
	onVerify: (token: string) => void;
}) {
	const [HCaptcha, setHCaptcha] = useState<typeof import('@hcaptcha/react-hcaptcha').default | null>(null);

	useEffect(() => {
		import('@hcaptcha/react-hcaptcha').then((mod) => setHCaptcha(() => mod.default));
	}, []);

	if (!HCaptcha) {
		return (
			<div className="w-[303px] h-[78px] bg-neutral-100 rounded animate-pulse flex items-center justify-center">
				<div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
			</div>
		);
	}

	return <HCaptcha sitekey={siteKey} onVerify={onVerify} />;
}

export default function VotingPageClient(props: VotingPageClientProps) {
	const validLocale = (props.locale === 'en' ? 'en' : 'pt-BR') as PictureContestLocale;

	return (
		<PictureContestLocaleProvider locale={validLocale}>
			<VotingToaster />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<VotingContent
					photos={props.photos}
					isActive={props.isActive}
					closesAt={props.closesAt}
				/>
			</div>
		</PictureContestLocaleProvider>
	);
}
