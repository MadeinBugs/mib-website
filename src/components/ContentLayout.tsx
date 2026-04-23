'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { globalStyles } from '../lib/styles';
import { getImagePath } from '../lib/imagePaths';
import type { Translations } from '../lib/i18n';

interface ContentLayoutProps {
	children: React.ReactNode;
	translations: Translations;
	locale: string;
	showServicesNav?: boolean;
}

// Header navigation button component
interface NavButtonHeaderProps {
	href: string;
	imageSrc: string;
	hoverImageSrc: string;
	label: string;
	isActive: boolean;
	isMobile?: boolean;
}

function NavButtonHeader({ href, imageSrc, hoverImageSrc, label, isActive, isMobile = false }: NavButtonHeaderProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link
			href={href}
			className={`
		relative transition-all duration-200 hover:scale-105
		${isMobile ? 'w-20 h-20' : 'w-28 h-28'}
		${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
	  `}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			title={label}
		>
			<Image
				src={isHovered ? hoverImageSrc : imageSrc}
				alt={label}
				width={isMobile ? 64 : 96}
				height={isMobile ? 64 : 96}
				className="w-full h-full object-contain"
			/>
		</Link>
	);
}

export default function ContentLayout({ children, translations, locale, showServicesNav = false }: ContentLayoutProps) {
	const pathname = usePathname();

	// Header navigation items with button images (same as homepage navigation)
	const navItems = [
		{
			key: 'about',
			href: `/${locale}/about`,
			label: translations.navigation.about,
			imageSrc: getImagePath('/assets/about_button_idle.png'),
			hoverImageSrc: getImagePath('/assets/about_button_hover.png')
		},
		{
			key: 'portfolio',
			href: `/${locale}/portfolio`,
			label: translations.navigation.portfolio,
			imageSrc: getImagePath('/assets/portfolio_button_idle.png'),
			hoverImageSrc: getImagePath('/assets/portfolio_button_hover.png')
		},
		{
			key: 'contact',
			href: `/${locale}/contact`,
			label: translations.navigation.contact,
			imageSrc: getImagePath('/assets/contact_button_idle.png'),
			hoverImageSrc: getImagePath('/assets/contact_button_hover.png')
		}
	];

	return (
		<div
			className={`min-h-screen bg-gradient-to-br ${globalStyles.backgroundColor}`}
		>
			{/* Header - seamless with background, 50% larger */}
			<header className="static z-50 pt-9 pb-6">
				<div className="max-w-6xl mx-auto px-6">
					{/* Mobile: Centered logo and cards below 768px */}
					<div className="md:hidden flex flex-col items-center">
						<Link href={`/${locale}`} className="w-24 h-24 mx-auto mb-2">
							<div className="w-24 h-24 relative hover:scale-105 transition-transform duration-200">
								<Image
									src={getImagePath('/assets/logo-no-title.png')}
									alt="Made in Bugs Logo"
									width={96}
									height={96}
									className="w-full h-full object-contain"
									priority
								/>
							</div>
						</Link>
						<nav className="w-full flex flex-col items-center mt-2">
							<div className="flex flex-row justify-center items-center gap-12 w-full custom-gap">
								{navItems.map((item) => (
									<NavButtonHeader
										key={item.key}
										href={item.href}
										imageSrc={item.imageSrc}
										hoverImageSrc={item.hoverImageSrc}
										label={item.label}
										isActive={pathname === item.href}
										isMobile={true}
									/>
								))}
							</div>
							{showServicesNav && (
								<Link
									href={`/${locale}/services`}
									className={`mt-3 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${pathname.startsWith(`/${locale}/services`)
											? 'bg-blue-600 text-white'
											: 'text-white bg-white/10 hover:bg-white/20'
										}`}
								>
									{translations.navigation.services}
								</Link>
							)}
						</nav>
					</div>

					{/* Desktop: Original layout */}
					<div className="hidden md:flex items-center justify-between">
						{/* Logo - left aligned and larger */}
						<Link href={`/${locale}`} className="flex-shrink-0">
							<div className="w-24 h-24 relative hover:scale-105 transition-transform duration-200">
								<Image
									src={getImagePath('/assets/logo-no-title.png')}
									alt="Made in Bugs Logo"
									width={96}
									height={96}
									className="w-full h-full object-contain"
									priority
								/>
							</div>
						</Link>

						{/* Navigation Buttons - centered */}
						<nav className="flex items-center space-x-12">
							{navItems.map((item) => (
								<NavButtonHeader
									key={item.key}
									href={item.href}
									imageSrc={item.imageSrc}
									hoverImageSrc={item.hoverImageSrc}
									label={item.label}
									isActive={pathname === item.href}
								/>
							))}
							{showServicesNav && (
								<Link
									href={`/${locale}/services`}
									className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${pathname.startsWith(`/${locale}/services`)
											? 'bg-blue-600 text-white'
											: 'text-white bg-white/10 hover:bg-white/20'
										}`}
								>
									{translations.navigation.services}
								</Link>
							)}
						</nav>

						{/* Language Switcher - right aligned */}
						<div className="flex-shrink-0">
							<LanguageSwitcher translations={translations.common.language_switcher} />
						</div>
					</div>
					<style jsx global>{`
				@media (max-width: 400px) {
					.custom-gap {
						gap: 4px !important;
					}
				}
			`}</style>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto px-6 py-0">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-8 mt-16">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<p className="text-gray-400">
						© 2025 Made in Bugs. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
