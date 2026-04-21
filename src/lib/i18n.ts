import { promises as fs } from 'fs';
import path from 'path';

// Define the structure of our translation files
export interface Translations {
	navigation: {
		about: string;
		portfolio: string;
		contact: string;
	};
	homepage: {
		title: string;
		subtitle: string;
		description: string;
	};
	pages: {
		about: {
			title: string;
			description: string;
		};
		portfolio: {
			title: string;
			description: string;
		};
		contact: {
			title: string;
			description: string;
		};
	};
	ui: {
		language: string;
		loading: string;
		error: string;
	};
	common: {
		language_switcher: {
			portuguese: string;
			english: string;
		};
	};
	legal: {
		backToTerms: string;
		backToPrivacy: string;
	};
}

// Cache for translations to avoid repeated file reads
const translationCache = new Map<string, Translations>();

export async function getTranslations(locale: string): Promise<Translations> {
	// Return cached translation if available
	if (translationCache.has(locale)) {
		return translationCache.get(locale)!;
	}

	try {
		// Read the translation file
		const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
		const fileContent = await fs.readFile(filePath, 'utf8');
		const translations = JSON.parse(fileContent) as Translations;

		// Cache the translation
		translationCache.set(locale, translations);

		return translations;
	} catch (error) {
		console.error(`Failed to load translations for locale "${locale}":`, error);

		// Fallback to pt-BR if the requested locale fails and it's not pt-BR
		if (locale !== 'pt-BR') {
			console.log('Falling back to pt-BR locale');
			return getTranslations('pt-BR');
		}

		// If pt-BR also fails, throw error
		throw new Error(`Failed to load translations for locale "${locale}"`);
	}
}

// Utility function to validate locale
export function isValidLocale(locale: string): boolean {
	const supportedLocales = ['pt-BR', 'en'];
	return supportedLocales.includes(locale);
}

// Get the default locale
export function getDefaultLocale(): string {
	return 'pt-BR';
}

// Normalize locale (handle variations)
export function normalizeLocale(locale: string): string {
	switch (locale.toLowerCase()) {
		case 'en':
		case 'en-us':
			return 'en';
		case 'pt':
		case 'pt-br':
			return 'pt-BR';
		default:
			return getDefaultLocale();
	}
}
