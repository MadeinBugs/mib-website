'use client';

import type { ThirdPartyCost, Locale, Currency } from '../../../lib/services/types';
import PriceDisplay from '../shared/PriceDisplay';

interface ThirdPartyCostsListProps {
	costs: ThirdPartyCost[];
	locale: Locale;
	currency: Currency;
}

export default function ThirdPartyCostsList({ costs, locale, currency }: ThirdPartyCostsListProps) {
	if (costs.length === 0) return null;

	return (
		<div className="space-y-2">
			<h3 className="text-sm font-semibold text-neutral-700">
				{locale === 'en' ? 'Third-Party Costs (estimated)' : 'Custos de Terceiros (estimativa)'}
			</h3>
			<p className="text-[10px] text-neutral-400">
				{locale === 'en'
					? 'These are paid directly to providers, not included in our pricing.'
					: 'Pagos diretamente aos provedores, não inclusos em nosso preço.'}
			</p>
			<ul className="space-y-1">
				{costs.map((cost) => (
					<li key={cost.id} className="flex items-center justify-between text-xs">
						<span className="text-neutral-600">{cost.label[locale]}</span>
						<span className="text-neutral-500 shrink-0">
							~<PriceDisplay amount={cost.amount[currency]} currency={currency} size="sm" />
							/{cost.frequency === 'monthly'
								? (locale === 'en' ? 'mo' : 'mês')
								: cost.frequency === 'yearly'
									? (locale === 'en' ? 'yr' : 'ano')
									: (locale === 'en' ? 'once' : 'único')}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
