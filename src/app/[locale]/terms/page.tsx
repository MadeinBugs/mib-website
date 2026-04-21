import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import LegalIndex from '../../../components/legal/LegalIndex';
import { termsIndex } from '../../../lib/legal/terms-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en' ? 'Terms of Service — Made in Bugs' : 'Termos de Serviço — Made in Bugs',
	};
}

export default async function TermsIndexPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	return <LegalIndex translations={t} locale={locale} basePath="terms" content={termsIndex} />;
}
