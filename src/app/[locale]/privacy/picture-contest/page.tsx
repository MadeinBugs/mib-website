import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import LegalPage from '../../../../components/legal/LegalPage';
import { pictureContestPrivacy } from '../../../../lib/legal/privacy-content';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'Picture Contest Privacy Policy — Made in Bugs'
			: 'Política de Privacidade do Concurso de Fotos — Made in Bugs',
	};
}

export default async function PictureContestPrivacyPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	return (
		<LegalPage
			translations={t}
			locale={locale}
			content={pictureContestPrivacy}
			backHref={`/${locale}/privacy`}
			backLabel={t.legal.backToPrivacy}
		/>
	);
}
