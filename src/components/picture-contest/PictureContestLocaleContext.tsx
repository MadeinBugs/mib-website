'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
	pictureContestTranslations,
	type PictureContestLocale,
	type PictureContestTranslations,
} from '@/lib/pictureContestI18n';

const PictureContestLocaleContext = createContext<{
	locale: PictureContestLocale;
	t: PictureContestTranslations;
}>({
	locale: 'pt-BR',
	t: pictureContestTranslations['pt-BR'],
});

export function PictureContestLocaleProvider({
	locale,
	children,
}: {
	locale: PictureContestLocale;
	children: ReactNode;
}) {
	const validLocale: PictureContestLocale =
		locale in pictureContestTranslations ? locale : 'pt-BR';

	return (
		<PictureContestLocaleContext.Provider
			value={{ locale: validLocale, t: pictureContestTranslations[validLocale] }}
		>
			{children}
		</PictureContestLocaleContext.Provider>
	);
}

export function usePictureContestLocale() {
	return useContext(PictureContestLocaleContext);
}
