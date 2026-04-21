import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import LegalPage from '../../../../components/legal/LegalPage';
import { getNewsletterTerms } from '../../../../lib/legal/terms-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'Newsletter Terms — Made in Bugs'
			: 'Termos da Newsletter — Made in Bugs',
	};
}

export default async function NewsletterTermsPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);
	const privacyHref = `/${locale}/privacy/newsletter`;

	return (
		<LegalPage
			translations={t}
			locale={locale}
			content={getNewsletterTerms(locale as 'en' | 'pt-BR', privacyHref)}
			backHref={`/${locale}/terms`}
			backLabel={t.legal.backToTerms}
		/>
	);
}

