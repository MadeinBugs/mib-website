import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import LegalIndex from '../../../components/legal/LegalIndex';
import { privacyIndex } from '../../../lib/legal/privacy-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en' ? 'Privacy Policy — Made in Bugs' : 'Política de Privacidade — Made in Bugs',
	};
}

export default async function PrivacyIndexPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	return <LegalIndex translations={t} locale={locale} basePath="privacy" content={privacyIndex} />;
}
