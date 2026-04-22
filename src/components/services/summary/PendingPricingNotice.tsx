'use client';

import type { Locale } from '../../../lib/services/types';

interface PendingPricingNoticeProps {
	locale: Locale;
	count: number;
}

export default function PendingPricingNotice({ locale, count }: PendingPricingNoticeProps) {
	if (count === 0) return null;

	return (
		<div className="rounded-lg bg-amber-900/20 border border-amber-800/30 px-3 py-2 text-xs text-amber-400">
			<p className="font-medium">
				⏱ {locale === 'en'
					? `${count} item${count > 1 ? 's' : ''} require${count === 1 ? 's' : ''} manual review`
					: `${count} ite${count > 1 ? 'ns requerem' : 'm requer'} revisão manual`}
			</p>
			<p className="mt-0.5 text-amber-500">
				{locale === 'en'
					? 'Final pricing will be included in your personalized quote.'
					: 'O preço final será incluído no seu orçamento personalizado.'}
			</p>
		</div>
	);
}
