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

/** Formats a YYYY-MM-DD version string as a localized date (e.g. "April 1st 2026" / "1 de abril de 2026"). */
export function formatVersionDate(version: string, locale: Locale): string {
	const [year, month, day] = version.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
