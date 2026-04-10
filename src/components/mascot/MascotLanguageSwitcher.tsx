'use client';

import { useMascotLocale } from './MascotLocaleContext';
import type { MascotLocale } from '@/lib/mascotI18n';

interface MascotLanguageSwitcherProps {
	inHeader?: boolean;
}

export default function MascotLanguageSwitcher({ inHeader = false }: MascotLanguageSwitcherProps) {
	const { locale, setLocale } = useMascotLocale();

	const toggle = (l: MascotLocale) => setLocale(l);

	// When inside the header, render inline (not fixed-positioned)
	// When floating (auth pages), use the site's .language-switcher class (fixed top-right)
	const containerClass = inHeader
		? 'flex gap-2'
		: 'language-switcher';

	return (
		<div className={containerClass}>
			<button
				onClick={() => toggle('pt-BR')}
				className={`flag-button flex items-center justify-center text-white font-bold ${locale === 'pt-BR'
					? 'bg-green-600 ring-2 ring-green-300'
					: 'bg-green-500 hover:bg-green-600'
					}`}
				title="Português (Brasil)"
			>
				🇧🇷
			</button>
			<button
				onClick={() => toggle('en')}
				className={`flag-button flex items-center justify-center text-white font-bold ${locale === 'en'
					? 'bg-blue-600 ring-2 ring-blue-300'
					: 'bg-blue-500 hover:bg-blue-600'
					}`}
				title="English"
			>
				🇺🇸
			</button>
		</div>
	);
}
