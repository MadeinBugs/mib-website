import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { iconMap } from '@/lib/links/icon-map';
import { withUtm } from '@/lib/links/utm';
import type { LinkItem, LocalizedString, Profile } from '@/lib/links/types';

interface LinksHubProps {
	locale: string;
	rawLocale: string;
	profile: Profile;
	featured: LinkItem[];
	regular: LinkItem[];
	source: 'studio' | 'asumi';
	backLabel: LocalizedString;
}

function resolveUrl(link: LinkItem, locale: string, source: 'studio' | 'asumi'): string {
	const url = link.url;
	// Internal relative links get locale prefix
	if (url.startsWith('/')) {
		return `/${locale}${url}`;
	}
	return withUtm(url, link.id, source);
}

function isExternal(url: string): boolean {
	return url.startsWith('http://') || url.startsWith('https://');
}

export default function LinksHub({
	locale,
	rawLocale,
	profile,
	featured,
	regular,
	source,
	backLabel,
}: LinksHubProps) {
	const loc = locale as 'pt-BR' | 'en';

	return (
		<main
			className="relative min-h-screen flex flex-col items-center"
			style={{ backgroundColor: '#0a0a0a' }}
		>
			{/* Language switcher */}
			<div className="absolute top-4 right-4 z-20">
				<LanguageSwitcher />
			</div>

			{/* Back to site */}
			<Link
				href={`/${rawLocale}`}
				className="absolute top-4 left-4 z-20 text-sm text-white/60 hover:text-white/90 transition-colors font-body"
			>
				{backLabel[loc]}
			</Link>

			{/* Content */}
			<div className="w-full max-w-[480px] mx-auto px-4 pt-20 pb-10 flex flex-col items-center gap-6">
				{/* Avatar */}
				<Image
					src={profile.avatar}
					alt={profile.name[loc]}
					width={96}
					height={96}
					priority
					className="rounded-full"
				/>

				{/* Name & bio */}
				<div className="text-center">
					<h1
						className="text-2xl font-bold text-white mb-1"
						style={{
							fontFamily: "'Amatic SC', cursive",
							fontSize: '2.5rem',
							color: '#ffffff',
							textShadow: 'none',
						}}
					>
						{profile.name[loc]}
					</h1>
					<p className="font-body text-sm text-white/70">
						{profile.bio[loc]}
					</p>
				</div>

				{/* Featured links */}
				{featured.length > 0 && (
					<nav aria-label={loc === 'pt-BR' ? 'Links em destaque' : 'Featured links'} className="w-full flex flex-col gap-3">
						{featured.map((link) => {
							const href = resolveUrl(link, locale, source);
							const external = isExternal(href);
							const Icon = iconMap[link.iconName];
							return (
								<a
									key={link.id}
									href={href}
									target={external ? '_blank' : undefined}
									rel={external ? 'noopener noreferrer' : undefined}
									aria-label={
										external
											? (loc === 'pt-BR'
												? `Abrir ${link.title[loc]} em nova aba`
												: `Open ${link.title[loc]} in new tab`)
											: link.title[loc]
									}
									className="flex items-center gap-4 w-full min-h-[56px] px-5 py-3 rounded-lg border-2 border-amber-400 bg-amber-400/10 text-white font-body text-base hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
								>
									<Icon aria-hidden="true" className="w-5 h-5 shrink-0 text-amber-300" />
									<span className="flex-1">{link.title[loc]}</span>
								</a>
							);
						})}
					</nav>
				)}

				{/* Divider */}
				{featured.length > 0 && regular.length > 0 && (
					<div className="w-full border-t border-white/10" />
				)}

				{/* Regular links */}
				{regular.length > 0 && (
					<nav aria-label={loc === 'pt-BR' ? 'Links' : 'Links'} className="w-full flex flex-col gap-3">
						{regular.map((link) => {
							const href = resolveUrl(link, locale, source);
							const external = isExternal(href);
							const Icon = iconMap[link.iconName];
							return (
								<a
									key={link.id}
									href={href}
									target={external ? '_blank' : undefined}
									rel={external ? 'noopener noreferrer' : undefined}
									aria-label={
										external
											? (loc === 'pt-BR'
												? `Abrir ${link.title[loc]} em nova aba`
												: `Open ${link.title[loc]} in new tab`)
											: link.title[loc]
									}
									className="flex items-center gap-4 w-full min-h-[56px] px-5 py-3 rounded-lg border border-white/20 bg-white/5 text-white font-body text-base hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
								>
									<Icon aria-hidden="true" className="w-5 h-5 shrink-0 text-white/60" />
									<span className="flex-1">{link.title[loc]}</span>
								</a>
							);
						})}
					</nav>
				)}
			</div>
		</main>
	);
}
