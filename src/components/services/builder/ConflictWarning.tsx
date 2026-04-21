'use client';

import type { Locale } from '../../../lib/services/types';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConflictWarningProps {
	locale: Locale;
	conflictingServiceNames: string[];
}

export default function ConflictWarning({ locale, conflictingServiceNames }: ConflictWarningProps) {
	if (conflictingServiceNames.length === 0) return null;

	const names = conflictingServiceNames.join(', ');

	return (
		<div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-md px-3 py-2 border border-red-200">
			<FaExclamationTriangle className="shrink-0 mt-0.5" />
			<span>
				{locale === 'en'
					? `Conflicts with: ${names}. Remove the conflicting service first.`
					: `Conflita com: ${names}. Remova o serviço conflitante primeiro.`}
			</span>
		</div>
	);
}
