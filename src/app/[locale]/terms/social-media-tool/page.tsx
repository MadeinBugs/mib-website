import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import LegalPage from '../../../../components/legal/LegalPage';
import { socialMediaToolTerms } from '../../../../lib/legal/terms-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'Social Media Tool Terms — Made in Bugs'
			: 'Termos da Ferramenta de Mídias Sociais — Made in Bugs',
	};
}

export default async function SocialMediaToolTermsPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	return (
		<LegalPage
			translations={t}
			locale={locale}
			content={socialMediaToolTerms}
			backHref={`/${locale}/terms`}
			backLabel={t.legal.backToTerms}
		/>
	);
}

