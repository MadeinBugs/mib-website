import type { Metadata } from 'next';
import UnsubscribePageClient from './UnsubscribePageClient';

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

export const metadata: Metadata = {
	title: 'Unsubscribe — Made in Bugs',
};

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function UnsubscribePage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = rawLocale === 'pt-BR' ? 'pt-BR' : 'en';

	return <UnsubscribePageClient locale={locale} />;
}
