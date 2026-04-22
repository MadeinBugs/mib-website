'use client';

import type { Locale } from '../../../lib/services/types';

interface MaintenanceSelectorProps {
	locale: Locale;
	months: 0 | 3 | 6 | 12;
	onChange: (months: 0 | 3 | 6 | 12) => void;
}

const OPTIONS: Array<{ value: 0 | 3 | 6 | 12; labelEn: string; labelPt: string }> = [
	{ value: 0, labelEn: 'No maintenance', labelPt: 'Sem manutenção' },
	{ value: 3, labelEn: '3 months', labelPt: '3 meses' },
	{ value: 6, labelEn: '6 months', labelPt: '6 meses' },
	{ value: 12, labelEn: '12 months', labelPt: '12 meses' },
];

export default function MaintenanceSelector({ locale, months, onChange }: MaintenanceSelectorProps) {
	return (
		<div className="space-y-1.5">
			<label className="text-sm font-semibold text-service-text-secondary">
				{locale === 'en' ? 'Maintenance Period' : 'Período de Manutenção'}
			</label>
			<select
				value={months}
				onChange={(e) => onChange(Number(e.target.value) as 0 | 3 | 6 | 12)}
				className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none"
			>
				{OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{locale === 'en' ? opt.labelEn : opt.labelPt}
					</option>
				))}
			</select>
		</div>
	);
}
