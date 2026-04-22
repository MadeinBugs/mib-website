'use client';

import type { ServiceItem, SelectedServiceItem, Locale, Currency, ThirdPartyCost } from '../../../lib/services/types';
import type { BuilderAction } from '../../../lib/services/builder-types';
import { computeGrandTotal, countPendingItems, collectThirdPartyCosts } from '../../../lib/services/pricing';
import ItemizedList from './ItemizedList';
import PendingItemsList from './PendingItemsList';
import MaintenanceSelector from './MaintenanceSelector';
import ThirdPartyCostsList from './ThirdPartyCostsList';
import PriceTotals from './PriceTotals';
import PendingPricingNotice from './PendingPricingNotice';
import CurrencyToggle from '../shared/CurrencyToggle';

interface SummaryPanelProps {
	catalog: ServiceItem[];
	selectedItems: Record<string, SelectedServiceItem>;
	locale: Locale;
	currency: Currency;
	maintenanceMonths: 0 | 3 | 6 | 12;
	bundleAdded: string[];
	dispatch: React.Dispatch<BuilderAction>;
	onSubmitClick: () => void;
}

export default function SummaryPanel({
	catalog,
	selectedItems,
	locale,
	currency,
	maintenanceMonths,
	bundleAdded,
	dispatch,
	onSubmitClick,
}: SummaryPanelProps) {
	const selectedArray = Object.values(selectedItems);
	const hasItems = selectedArray.length > 0;

	const totals = computeGrandTotal(catalog, selectedArray, currency, maintenanceMonths, bundleAdded);
	const { count: pendingCount } = countPendingItems(catalog, selectedArray);
	const thirdPartyCosts: ThirdPartyCost[] = collectThirdPartyCosts(catalog, selectedArray, currency);

	return (
		<div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-neutral-800">
					{locale === 'en' ? 'Summary' : 'Resumo'}
				</h2>
				<CurrencyToggle
					currency={currency}
					onChange={(c) => dispatch({ type: 'SET_CURRENCY', currency: c })}
				/>
			</div>

			{!hasItems && (
				<p className="text-sm text-neutral-400 py-4 text-center">
					{locale === 'en'
						? 'Select services to build your quote'
						: 'Selecione serviços para montar seu orçamento'}
				</p>
			)}

			{hasItems && (
				<>
					<ItemizedList
						catalog={catalog}
						selectedItems={selectedArray}
						locale={locale}
						currency={currency}
						bundleAdded={bundleAdded}
					/>

					<PendingItemsList
						catalog={catalog}
						selectedItems={selectedArray}
						locale={locale}
					/>

					<MaintenanceSelector
						locale={locale}
						months={maintenanceMonths}
						onChange={(months) => dispatch({ type: 'SET_MAINTENANCE_MONTHS', months })}
					/>

					<ThirdPartyCostsList costs={thirdPartyCosts} locale={locale} currency={currency} />

					<PriceTotals
						locale={locale}
						currency={currency}
						setup={totals.setup}
						maintenanceMonthly={totals.maintenanceMonthly}
						maintenanceTotal={totals.maintenanceTotal}
						grandTotal={totals.grandTotal}
						maintenanceMonths={maintenanceMonths}
					/>

					<PendingPricingNotice locale={locale} count={pendingCount} />

					<button
						type="button"
						onClick={onSubmitClick}
						className="w-full btn-crayon bg-[#04c597] hover:bg-[#036b54] text-white font-semibold py-3 rounded-lg transition-colors"
					>
						{locale === 'en' ? 'Request Quote' : 'Solicitar Orçamento'}
					</button>
				</>
			)}
		</div>
	);
}
