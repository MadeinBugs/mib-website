'use client';

import type { Currency } from '../../../lib/services/types';

interface CurrencyToggleProps {
	currency: Currency;
	onChange: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onChange }: CurrencyToggleProps) {
	return (
		<div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden text-sm">
			<button
				type="button"
				onClick={() => onChange('BRL')}
				className={`px-3 py-1.5 font-medium transition-colors ${currency === 'BRL'
						? 'bg-[#04c597] text-white'
						: 'bg-white text-neutral-600 hover:bg-neutral-50'
					}`}
			>
				R$ BRL
			</button>
			<button
				type="button"
				onClick={() => onChange('USD')}
				className={`px-3 py-1.5 font-medium transition-colors ${currency === 'USD'
						? 'bg-[#04c597] text-white'
						: 'bg-white text-neutral-600 hover:bg-neutral-50'
					}`}
			>
				$ USD
			</button>
		</div>
	);
}
