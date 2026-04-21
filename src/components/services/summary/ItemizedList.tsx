'use client';

import type { ServiceItem, SelectedServiceItem, Locale, Currency } from '../../../lib/services/types';
import { computeSetupPrice } from '../../../lib/services/pricing';
import PriceDisplay from '../shared/PriceDisplay';

interface ItemizedListProps {
	catalog: ServiceItem[];
	selectedItems: SelectedServiceItem[];
	locale: Locale;
	currency: Currency;
}

export default function ItemizedList({ catalog, selectedItems, locale, currency }: ItemizedListProps) {
	if (selectedItems.length === 0) return null;

	return (
		<div className="space-y-2">
			<h3 className="text-sm font-semibold text-neutral-700">
				{locale === 'en' ? 'Selected Services' : 'Serviços Selecionados'}
			</h3>
			<ul className="space-y-1.5">
				{selectedItems.map((item) => {
					const service = catalog.find((s) => s.id === item.serviceId);
					if (!service) return null;

					const itemPrice = computeSetupPrice(catalog, [item], currency);

					return (
						<li key={item.serviceId} className="flex items-center justify-between text-sm">
							<span className="text-neutral-600 truncate mr-2">
								{service.name[locale]}
							</span>
							<PriceDisplay amount={itemPrice} currency={currency} size="sm" className="text-neutral-800 font-medium shrink-0" />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
