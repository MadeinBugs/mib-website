'use client';

import type { Locale } from '../../../lib/services/types';
import { FaLink } from 'react-icons/fa';

interface DependencyIndicatorProps {
	locale: Locale;
	/** The name of the service that caused the auto-add */
	requiredByName: string;
}

export default function DependencyIndicator({ locale, requiredByName }: DependencyIndicatorProps) {
	return (
		<div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1">
			<FaLink className="shrink-0" />
			<span>
				{locale === 'en'
					? `Auto-added because "${requiredByName}" requires it`
					: `Adicionado automaticamente pois "${requiredByName}" necessita`}
			</span>
		</div>
	);
}
