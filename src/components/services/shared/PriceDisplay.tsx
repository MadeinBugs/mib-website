'use client';

import type { Currency } from '../../../lib/services/types';
import { formatPrice } from '../../../lib/services/format';

interface PriceDisplayProps {
	amount: number;
	currency: Currency;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({ amount, currency, className, size = 'md' }: PriceDisplayProps) {
	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-xl font-bold',
	};

	return (
		<span className={`${sizeClasses[size]} ${className ?? ''}`}>
			{formatPrice(amount, currency)}
		</span>
	);
}
