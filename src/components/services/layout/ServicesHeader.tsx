'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/services/types';

interface ServicesHeaderProps {
	locale: Locale;
}

export default function ServicesHeader({ locale }: ServicesHeaderProps) {
	const pathname = usePathname();

	const switchLanguage = (target: string) => {
		const segments = pathname.split('/');
		segments[1] = target;
		return segments.join('/');
	};

	const currentLocale = pathname.split('/')[1];

	return (
		<header className="border-b border-service-border bg-service-bg/80 backdrop-blur-sm sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
				<Link
					href={`/${locale}`}
					className="flex items-center gap-2 text-service-text-primary hover:text-service-accent transition-colors"
				>
					<span className="font-bold text-lg tracking-tight">Made in Bugs</span>
					<span className="text-xs text-service-text-tertiary hidden sm:inline">/ Services</span>
				</Link>

				<nav className="flex items-center gap-4 sm:gap-6">
					<Link
						href={`/${locale}/services`}
						className="text-sm text-service-text-secondary hover:text-service-text-primary transition-colors hidden sm:inline"
					>
						{locale === 'en' ? 'Overview' : 'Visão Geral'}
					</Link>
					<Link
						href={`/${locale}/services/infra-builder`}
						className="text-sm text-service-text-secondary hover:text-service-text-primary transition-colors hidden sm:inline"
					>
						Builder
					</Link>
					<a
						href="https://agenda.madeinbugs.com.br/andressmartin/consultoria-infraestrutura"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-service-text-secondary hover:text-service-text-primary transition-colors hidden sm:inline"
					>
						{locale === 'en' ? 'Talk to us' : 'Fale conosco'}
					</a>
					<div className="flex items-center gap-1">
						<Link
							href={switchLanguage('pt-BR')}
							className={`px-2 py-1 rounded text-xs font-medium transition-colors ${currentLocale === 'pt-BR'
									? 'bg-service-accent text-white'
									: 'text-service-text-secondary hover:text-service-text-primary'
								}`}
						>
							PT
						</Link>
						<Link
							href={switchLanguage('en')}
							className={`px-2 py-1 rounded text-xs font-medium transition-colors ${currentLocale === 'en'
									? 'bg-service-accent text-white'
									: 'text-service-text-secondary hover:text-service-text-primary'
								}`}
						>
							EN
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
