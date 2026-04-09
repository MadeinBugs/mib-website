'use client';

import { type ReactNode } from 'react';
import { MascotLocaleProvider, useMascotLocale } from './MascotLocaleContext';
import MascotLanguageSwitcher from './MascotLanguageSwitcher';

function MascotHeader({ displayName }: { displayName: string | null }) {
	const { t } = useMascotLocale();

	return (
		<header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b-2 border-amber-200">
			<div className="flex items-center gap-3">
				<h2 className="font-logo text-lg text-neutral-800">
					{t.headerTitle}
				</h2>
			</div>
			<div className="flex items-center gap-4">
				<MascotLanguageSwitcher />
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
}: {
	children: ReactNode;
	isLoggedIn: boolean;
	displayName: string | null;
}) {
	return (
		<MascotLocaleProvider>
			<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
				{isLoggedIn && <MascotHeader displayName={displayName} />}
				{!isLoggedIn && (
					<div className="absolute top-4 right-4 z-10">
						<MascotLanguageSwitcher />
					</div>
				)}
				<main>{children}</main>
			</div>
		</MascotLocaleProvider>
	);
}
