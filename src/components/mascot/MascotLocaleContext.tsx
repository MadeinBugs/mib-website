'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mascotTranslations, type MascotLocale, type MascotTranslations } from '@/lib/mascotI18n';

const STORAGE_KEY = 'mascot_locale';

const MascotLocaleContext = createContext<{
	locale: MascotLocale;
	t: MascotTranslations;
	setLocale: (l: MascotLocale) => void;
}>({
	locale: 'pt-BR',
	t: mascotTranslations['pt-BR'],
	setLocale: () => { },
});

export function MascotLocaleProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<MascotLocale>('pt-BR');

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY) as MascotLocale | null;
			if (stored && stored in mascotTranslations) {
				setLocaleState(stored);
			}
		} catch { /* localStorage unavailable */ }
	}, []);

	const setLocale = (l: MascotLocale) => {
		setLocaleState(l);
		try {
			localStorage.setItem(STORAGE_KEY, l);
		} catch { /* localStorage unavailable */ }
	};

	return (
		<MascotLocaleContext.Provider value={{ locale, t: mascotTranslations[locale], setLocale }}>
			{children}
		</MascotLocaleContext.Provider>
	);
}

export function useMascotLocale() {
	return useContext(MascotLocaleContext);
}
