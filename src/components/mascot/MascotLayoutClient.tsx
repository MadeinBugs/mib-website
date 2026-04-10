'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import { MascotLocaleProvider, useMascotLocale } from './MascotLocaleContext';
import MascotLanguageSwitcher from './MascotLanguageSwitcher';
import { getImagePath } from '@/lib/imagePaths';

function MascotHeader({ displayName, userRole }: { displayName: string | null; userRole: string | null }) {
	const { t } = useMascotLocale();

	return (
		<header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b-2 border-amber-200">
			<a href="/pt-BR" className="hover:opacity-80 transition-opacity hover:scale-105 transform duration-200">
				<Image
					src={getImagePath('/assets/logo-no-title.png')}
					alt="Made in Bugs"
					width={48}
					height={48}
					className="w-12 h-12 object-contain"
				/>
			</a>
			<div className="flex items-center gap-4">
				{userRole === 'artist' && (
					<a
						href="/mascot/gallery"
						className="text-sm font-body text-amber-600 hover:text-amber-700 font-semibold transition-colors"
					>
						{t.galleryLink}
					</a>
				)}
				<MascotLanguageSwitcher inHeader />
				<span className="text-sm font-body text-neutral-600">
					{displayName}
				</span>
				<a
					href="/mascot/logout"
					className="text-sm font-body text-primary-500 hover:text-primary-600 font-semibold transition-colors"
				>
					{t.signOut}
				</a>
			</div>
		</header>
	);
}

export default function MascotLayoutClient({
	children,
	isLoggedIn,
	displayName,
	userRole,
}: {
	children: ReactNode;
	isLoggedIn: boolean;
	displayName: string | null;
	userRole: string | null;
}) {
	return (
		<MascotLocaleProvider>
			<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
				{isLoggedIn && <MascotHeader displayName={displayName} userRole={userRole} />}
				{!isLoggedIn && <MascotLanguageSwitcher />}
				<main>{children}</main>
			</div>
		</MascotLocaleProvider>
	);
}
