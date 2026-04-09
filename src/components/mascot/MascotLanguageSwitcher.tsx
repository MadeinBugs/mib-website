'use client';

import { useMascotLocale } from './MascotLocaleContext';
import type { MascotLocale } from '@/lib/mascotI18n';

export default function MascotLanguageSwitcher() {
	const { locale, setLocale } = useMascotLocale();

	const toggle = (l: MascotLocale) => setLocale(l);

	return (
		<div className="flex gap-1">
			<button
				onClick={() => toggle('pt-BR')}
				className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all ${locale === 'pt-BR'
					? 'bg-green-600 ring-2 ring-green-300'
					: 'bg-green-500 hover:bg-green-600'
					}`}
				title="Português (Brasil)"
			>
				🇧🇷
			</button>
			<button
				onClick={() => toggle('en')}
				className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all ${locale === 'en'
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
