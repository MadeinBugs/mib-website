'use client';

import type { ServiceItem, SelectedServiceItem, Locale } from '../../../lib/services/types';
import PendingPricingBadge from '../builder/PendingPricingBadge';

interface PendingItemsListProps {
	catalog: ServiceItem[];
	selectedItems: SelectedServiceItem[];
	locale: Locale;
}

export default function PendingItemsList({ catalog, selectedItems, locale }: PendingItemsListProps) {
	const pending: Array<{ serviceName: string; fieldLabel: string; count: number }> = [];

	for (const item of selectedItems) {
		const service = catalog.find((s) => s.id === item.serviceId);
		if (!service) continue;
		for (const cf of item.customFields) {
			const fieldDef = service.customFields?.find((f) => f.id === cf.customFieldId);
			if (!fieldDef?.pendingPricing) continue;
			const nonEmpty = cf.values.filter((v) => v.trim().length > 0).length;
			if (nonEmpty > 0) {
				pending.push({
					serviceName: service.name[locale],
					fieldLabel: fieldDef.label[locale],
					count: nonEmpty,
				});
			}
		}
	}

	if (pending.length === 0) return null;

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<h3 className="text-sm font-semibold text-service-text-secondary">
					{locale === 'en' ? 'Pending Pricing' : 'Preço sob Consulta'}
				</h3>
				<PendingPricingBadge locale={locale} />
			</div>
			<ul className="space-y-1">
				{pending.map((p, i) => (
					<li key={i} className="text-xs text-service-text-secondary">
						{p.serviceName} — {p.fieldLabel}
						{p.count > 1 && ` (×${p.count})`}
					</li>
				))}
			</ul>
		</div>
	);
}
