'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PictureContestLocaleProvider, usePictureContestLocale } from './PictureContestLocaleContext';
import type { PictureContestLocale } from '@/lib/pictureContestI18n';

function LanguageSwitcher() {
	const { locale } = usePictureContestLocale();
	const pathname = usePathname();

	function switchedPath(targetLocale: PictureContestLocale) {
		return pathname.replace(/^\/(en|pt-BR)/, `/${targetLocale}`);
	}

	return (
		<div className="flex gap-2">
			<Link
				href={switchedPath('pt-BR')}
				className={`px-2 py-1 text-xs font-bold rounded transition-colors ${locale === 'pt-BR'
					? 'bg-green-600 text-white'
					: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
					}`}
			>
				PT
			</Link>
			<Link
				href={switchedPath('en')}
				className={`px-2 py-1 text-xs font-bold rounded transition-colors ${locale === 'en'
					? 'bg-blue-600 text-white'
					: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
					}`}
			>
				EN
			</Link>
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
			<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
				<div className="absolute top-4 right-4 z-10">
					<LanguageSwitcher />
				</div>
				<main>{children}</main>
			</div>
		</PictureContestLocaleProvider>
	);
}
