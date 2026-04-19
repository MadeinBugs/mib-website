'use client';

import { type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PictureContestLocaleProvider, usePictureContestLocale } from './PictureContestLocaleContext';
import type { PictureContestLocale } from '@/lib/pictureContestI18n';

function LanguageSwitcher() {
	const { locale } = usePictureContestLocale();
	const pathname = usePathname();
	const router = useRouter();

	function switchLanguage(targetLocale: PictureContestLocale) {
		const newPath = pathname.replace(/^\/(en|pt-br)/i, `/${targetLocale}`);
		router.push(newPath);
	}

	return (
		<div className="flex gap-2">
			<button
				onClick={() => switchLanguage('pt-BR')}
				className={`flag-button flex items-center justify-center text-white font-bold ${locale === 'pt-BR'
					? 'bg-green-600 ring-2 ring-green-300'
					: 'bg-green-500 hover:bg-green-600'
					}`}
				title="Português (Brasil)"
			>
				🇧🇷
			</button>
			<button
				onClick={() => switchLanguage('en')}
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

export default function PictureContestLayoutClient({
	children,
	locale,
}: {
	children: ReactNode;
	locale: string;
}) {
	const validLocale = (locale === 'en' ? 'en' : 'pt-BR') as PictureContestLocale;

	return (
		<PictureContestLocaleProvider locale={validLocale}>
			<div className="min-h-screen bg-[#f7fff0]">
				<div className="fixed top-4 right-4 z-50">
					<LanguageSwitcher />
				</div>
				<main>{children}</main>
			</div>
		</PictureContestLocaleProvider>
	);
}
