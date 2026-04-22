'use client';

import type { Currency } from '../../../lib/services/types';

interface CurrencyToggleProps {
	currency: Currency;
	onChange: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onChange }: CurrencyToggleProps) {
	return (
		<div className="inline-flex rounded-lg border border-service-border overflow-hidden text-sm">
			<button
				type="button"
				onClick={() => onChange('BRL')}
				className={`px-3 py-1.5 font-medium transition-colors ${currency === 'BRL'
					? 'bg-service-accent text-white'
					: 'bg-service-bg-strong text-service-text-secondary hover:bg-service-bg-strong/80'
					}`}
			>
				R$ BRL
			</button>
			<button
				type="button"
				onClick={() => onChange('USD')}
				className={`px-3 py-1.5 font-medium transition-colors ${currency === 'USD'
					? 'bg-service-accent text-white'
					: 'bg-service-bg-strong text-service-text-secondary hover:bg-service-bg-strong/80'
					}`}
			>
				$ USD
			</button>
		</div>
	);
}
