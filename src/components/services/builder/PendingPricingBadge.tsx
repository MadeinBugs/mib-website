'use client';

import type { Locale } from '../../../lib/services/types';
import { FaClock } from 'react-icons/fa';

interface PendingPricingBadgeProps {
	locale: Locale;
}

export default function PendingPricingBadge({ locale }: PendingPricingBadgeProps) {
	return (
		<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
			<FaClock />
			{locale === 'en' ? 'Quoted after review' : 'Orçado após análise'}
		</span>
	);
}
