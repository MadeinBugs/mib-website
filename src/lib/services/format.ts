import type { Currency, Locale } from './types';

export function formatPrice(amount: number, currency: Currency): string {
	if (currency === 'BRL') return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
	return `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: Date, locale: Locale): string {
	return date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
