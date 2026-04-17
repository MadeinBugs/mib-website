'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PictureContestLocaleProvider, usePictureContestLocale } from './PictureContestLocaleContext';
import { getImagePath } from '@/lib/imagePaths';
import type { PictureContestLocale } from '@/lib/pictureContestI18n';

function LanguageSwitcher() {
	const { locale } = usePictureContestLocale();
	const pathname = usePathname();

	function switchedPath(targetLocale: PictureContestLocale) {
		// Replace the locale prefix in the current path
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

function PictureContestHeader({ locale }: { locale: PictureContestLocale }) {
	const { t } = usePictureContestLocale();

	return (
		<header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b-2 border-amber-200">
			<div className="flex items-center gap-3">
				<Link href={`/${locale}`} className="hover:opacity-80 transition-opacity hover:scale-105 transform duration-200">
					<Image
						src={getImagePath('/assets/logo-no-title.png')}
						alt="Made in Bugs"
						width={48}
						height={48}
						className="w-12 h-12 object-contain"
					/>
				</Link>
				<span className="font-h2 text-lg font-bold text-amber-800">
					{t.headerTitle}
				</span>
			</div>
			<div className="flex items-center gap-4">
				<LanguageSwitcher />
				<a
					href={`/${locale}/picture-contest/logout`}
					className="text-sm font-body text-primary-500 hover:text-primary-600 font-semibold transition-colors"
				>
					{t.signOut}
				</a>
			</div>
		</header>
	);
}

export default function PictureContestLayoutClient({
	children,
	isLoggedIn,
	locale,
}: {
	children: ReactNode;
	isLoggedIn: boolean;
	locale: string;
}) {
	const validLocale = (locale === 'en' ? 'en' : 'pt-BR') as PictureContestLocale;

	return (
		<PictureContestLocaleProvider locale={validLocale}>
			<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
				{isLoggedIn && <PictureContestHeader locale={validLocale} />}
				{!isLoggedIn && (
					<div className="absolute top-4 right-4 z-10">
						<LanguageSwitcher />
					</div>
				)}
				<main>{children}</main>
			</div>
		</PictureContestLocaleProvider>
	);
}
