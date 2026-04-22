import { normalizeLocale } from '@/lib/i18n';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ServicesHeader from '@/components/services/layout/ServicesHeader';
import ServicesFooter from '@/components/services/layout/ServicesFooter';
import type { Locale } from '@/lib/services/types';
import './services-theme.css';

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-services-sans',
	display: 'swap',
});

const mono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-services-mono',
	display: 'swap',
});

interface Props {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function ServicesLayout({ children, params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale) as Locale;

	return (
		<div className={`services-theme ${inter.variable} ${mono.variable} min-h-screen`} style={{ fontFamily: 'var(--font-services-sans), Inter, system-ui, sans-serif' }}>
			<ServicesHeader locale={locale} />
			<main>{children}</main>
			<ServicesFooter locale={locale} />
		</div>
	);
}
