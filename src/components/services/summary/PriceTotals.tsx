'use client';

import type { Locale, Currency } from '../../../lib/services/types';
import PriceDisplay from '../shared/PriceDisplay';

interface PriceTotalsProps {
	locale: Locale;
	currency: Currency;
	setup: number;
	maintenanceMonthly: number;
	maintenanceTotal: number;
	grandTotal: number;
	maintenanceMonths: number;
}

export default function PriceTotals({
	locale,
	currency,
	setup,
	maintenanceMonthly,
	maintenanceTotal,
	grandTotal,
	maintenanceMonths,
}: PriceTotalsProps) {
	return (
		<div className="space-y-2 pt-2 border-t border-service-border">
			<div className="flex justify-between text-sm">
				<span className="text-service-text-secondary">
					{locale === 'en' ? 'Setup' : 'Implementação'}
				</span>
				<PriceDisplay amount={setup} currency={currency} size="sm" className="font-medium text-service-text-primary" />
			</div>

			{maintenanceMonths > 0 && (
				<>
					<div className="flex justify-between text-sm">
						<span className="text-service-text-secondary">
							{locale === 'en' ? 'Maintenance/mo' : 'Manutenção/mês'}
						</span>
						<PriceDisplay amount={maintenanceMonthly} currency={currency} size="sm" className="text-service-text-secondary" />
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-service-text-secondary">
							{locale === 'en'
								? `Maintenance (${maintenanceMonths} mo)`
								: `Manutenção (${maintenanceMonths} meses)`}
						</span>
						<PriceDisplay amount={maintenanceTotal} currency={currency} size="sm" className="font-medium text-service-text-primary" />
					</div>
				</>
			)}

			<div className="flex justify-between pt-2 border-t border-service-border-strong">
				<span className="font-bold text-service-text-primary">
					{locale === 'en' ? 'Total' : 'Total'}
				</span>
				<PriceDisplay amount={grandTotal} currency={currency} size="lg" className="text-service-accent" />
			</div>
		</div>
	);
}
