import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { iconMap } from '@/lib/links/icon-map';
import { withUtm } from '@/lib/links/utm';
import type { LinkItem, LocalizedString, Profile } from '@/lib/links/types';

interface Announcement {
	title: LocalizedString;
	description: LocalizedString;
}

interface LinksHubProps {
	locale: string;
	profile: Profile;
	featured: LinkItem[];
	regular: LinkItem[];
	source: 'studio' | 'asumi';
	announcement?: Announcement;
}

const BACK_LABEL = {
	'pt-BR': '← Voltar ao site',
	en: '← Back to site',
} as const;

function resolveUrl(link: LinkItem, locale: string, source: 'studio' | 'asumi'): string {
	if (link.url.startsWith('/')) {
		return `/${locale}${link.url}`;
	}
	return withUtm(link.url, link.id, source);
}

function isExternal(url: string): boolean {
	return url.startsWith('http://') || url.startsWith('https://');
}

function LinkEntry({ link, locale, source }: { link: LinkItem; locale: string; source: 'studio' | 'asumi' }) {
	const loc = locale as 'pt-BR' | 'en';
	const href = resolveUrl(link, locale, source);
	const external = isExternal(href);
	const Icon = iconMap[link.iconName];
	const isFeatured = link.featured;
	const variant = link.variant;

	const base = 'flex items-center gap-4 w-full min-h-[56px] px-5 py-3 font-body text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors';

	const variantClasses: Record<string, { container: string; icon: string }> = {
		rainbow: {
			container: `${base} rounded-[6px] bg-white/95 hover:bg-white text-[#1a3a34] font-semibold`,
			icon: 'w-5 h-5 shrink-0 text-pink-500',
		},
		discord: {
			container: `${base} rounded-lg border-2 border-[#5865F2] bg-[rgba(88,101,242,0.08)] text-[#1a3a34] hover:bg-[rgba(88,101,242,0.18)] focus-visible:ring-[#5865F2]`,
			icon: 'w-5 h-5 shrink-0 text-[#5865F2]',
		},
		buzzy: {
			container: `${base} rounded-lg border-2 border-amber-400 bg-[rgba(251,191,36,0.08)] text-[#1a3a34] hover:bg-[rgba(251,191,36,0.18)] focus-visible:ring-amber-400`,
			icon: 'w-5 h-5 shrink-0 text-amber-500',
		},
		featured: {
			container: `${base} rounded-lg border-2 border-[#36c8ab] bg-[rgba(54,200,171,0.08)] text-[#1a3a34] hover:bg-[rgba(54,200,171,0.18)] focus-visible:ring-[#36c8ab]`,
			icon: 'w-5 h-5 shrink-0 text-[#04c597]',
		},
		default: {
			container: `${base} rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-300`,
			icon: 'w-5 h-5 shrink-0 text-neutral-400',
		},
	};

	const style = variant && variantClasses[variant]
		? variantClasses[variant]
		: isFeatured
			? variantClasses.featured
			: variantClasses.default;

	const anchor = (
		<a
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			{...(external && {
				'aria-label': loc === 'pt-BR'
					? `${link.title[loc]} — abrir em nova aba`
					: `${link.title[loc]} — open in new tab`,
			})}
			className={style.container}
		>
			<Icon
				aria-hidden="true"
				className={style.icon}
			/>
			<div className="flex-1">
				<span>{link.title[loc]}</span>
				{link.description?.[loc] && (
					<span className="block text-xs text-neutral-600 mt-0.5">
						{link.description[loc]}
					</span>
				)}
			</div>
		</a>
	);

	if (variant === 'rainbow') {
		return (
			<div className="rounded-lg p-[2px] bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400">
				{anchor}
			</div>
		);
	}

	return anchor;
}

export default function LinksHub({
	locale,
	profile,
	featured,
	regular,
	source,
	announcement,
}: LinksHubProps) {
	const loc = locale as 'pt-BR' | 'en';

	return (
		<main className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 to-amber-50">
			{/* Language switcher */}
			<div className="absolute top-4 right-4 z-20">
				<LanguageSwitcher />
			</div>

			{/* Back to site */}
			<Link
				href={`/${locale}`}
				className="absolute top-4 left-4 z-20 text-sm text-neutral-500 hover:text-neutral-700 transition-colors font-body"
			>
				{BACK_LABEL[loc]}
			</Link>

			{/* Card */}
			<div
				className="w-full max-w-[480px] mx-4 mt-16 mb-8 rounded-lg overflow-hidden shadow-lg"
				style={{ borderColor: '#1e6259', borderWidth: '2px', borderStyle: 'solid' }}
			>
				{/* Banner — decorative, alt="" so screen readers skip it */}
				{profile.banner && (
					<Image
						src={profile.banner}
						alt=""
						width={960}
						height={320}
						priority
						sizes="(max-width: 480px) 100vw, 480px"
						className="w-full h-auto block"
					/>
				)}

				{/* Card body */}
				<div className="p-6" style={{ backgroundColor: '#f7fff0' }}>
					<header className="text-center mb-6">
						{/* Avatar */}
						<div className="flex justify-center mb-4">
							<Image
								src={profile.avatar}
								alt={profile.name[loc]}
								width={96}
								height={96}
								priority
								sizes="96px"
								className="rounded-full object-cover"
							/>
						</div>

						{/* Title — avoids h1 global !important override, same approach as bugsletter */}
						<div
							role="heading"
							aria-level={1}
							id="profile-name"
							style={{
								fontFamily: "var(--font-amatic), cursive",
								fontSize: 'clamp(2.5rem, 3vw + 1rem, 3.5rem)',
								fontWeight: 700,
								color: '#04c597',
								textShadow: '-1px 1px 0px #016a50',
							}}
						>
							{profile.name[loc]}
						</div>

						{/* Bio */}
						<p className="font-body text-sm text-neutral-600 mt-1">
							{profile.bio[loc]}
						</p>
					</header>

					{/* Announcement */}
					{announcement && (
						<div className="text-center mb-4 px-3 py-3 rounded-lg bg-[#fff8e1] border border-amber-300">
							<div className="font-body font-semibold text-[#1a3a34] text-sm">
								{announcement.title[loc]}
							</div>
							<p className="font-body text-xs text-neutral-600 mt-1">
								{announcement.description[loc]}
							</p>
						</div>
					)}

					{/* Featured links */}
					{featured.length > 0 && (
						<nav
							aria-label={loc === 'pt-BR' ? 'Links em destaque' : 'Featured links'}
							className="flex flex-col gap-3"
						>
							{featured.map((link) => (
								<LinkEntry key={link.id} link={link} locale={locale} source={source} />
							))}
						</nav>
					)}

					{/* Divider */}
					{featured.length > 0 && regular.length > 0 && (
						<div className="border-t border-neutral-200 my-4" />
					)}

					{/* Regular links */}
					{regular.length > 0 && (
						<nav
							aria-label={loc === 'pt-BR' ? 'Outros links' : 'More links'}
							className="flex flex-col gap-3"
						>
							{regular.map((link) => (
								<LinkEntry key={link.id} link={link} locale={locale} source={source} />
							))}
						</nav>
					)}
				</div>
			</div>
		</main>
	);
}
