import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import LegalPage from '../../../../components/legal/LegalPage';
import { newsletterPrivacy } from '../../../../lib/legal/privacy-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'Newsletter Privacy Policy — Made in Bugs'
			: 'Política de Privacidade da Newsletter — Made in Bugs',
	};
}

export default async function NewsletterPrivacyPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	return (
		<LegalPage
			translations={t}
			locale={locale}
			content={newsletterPrivacy}
			backHref={`/${locale}/privacy`}
			backLabel={t.legal.backToPrivacy}
		/>
	);
}
