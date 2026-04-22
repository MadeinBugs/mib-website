import { normalizeLocale } from '@/lib/i18n';
import ServicesHeader from '@/components/services/layout/ServicesHeader';
import ServicesFooter from '@/components/services/layout/ServicesFooter';
import type { Locale } from '@/lib/services/types';
import './services-theme.css';

interface Props {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function ServicesLayout({ children, params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale) as Locale;

	return (
		<div className="services-theme min-h-screen">
			<ServicesHeader locale={locale} />
			<main>{children}</main>
			<ServicesFooter locale={locale} />
		</div>
	);
}
