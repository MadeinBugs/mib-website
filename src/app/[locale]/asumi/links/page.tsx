import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/i18n';
import { links } from '@/lib/links/data';
import { profiles } from '@/lib/links/profiles';
import LinksHub from '@/components/links/LinksHub';

const SITE_URL = 'https://www.madeinbugs.com.br';
const OG_IMAGE_PATH = '/assets/links/asumi-links-og.jpg';

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const isPt = locale === 'pt-BR';

	return {
		title: 'Asumi — Links',
		description: isPt
			? 'Links oficiais do jogo Asumi.'
			: 'Official links for the Asumi game.',
		robots: {
			index: false,
			follow: true,
		},
		alternates: {
			languages: {
				'pt-BR': `${SITE_URL}/pt-BR/asumi/links`,
				en: `${SITE_URL}/en/asumi/links`,
			},
		},
		openGraph: {
			type: 'website',
			url: `${SITE_URL}/${locale}/asumi/links`,
			siteName: 'Made in Bugs',
			images: [
				{
					url: `${SITE_URL}${OG_IMAGE_PATH}`,
					width: 1200,
					height: 630,
					alt: 'Asumi — Links',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: 'Asumi — Links',
			description: isPt
				? 'Links oficiais do jogo Asumi.'
				: 'Official links for the Asumi game.',
			images: [`${SITE_URL}${OG_IMAGE_PATH}`],
		},
	};
}

export default async function AsumiLinksPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);

	const asumiLinks = links.filter(
		(link) => link.scope === 'asumi' || link.scope === 'both'
	);
	const featured = asumiLinks.filter((l) => l.featured);
	const regular = asumiLinks.filter((l) => !l.featured);

	return (
		<LinksHub
			locale={locale}
			rawLocale={rawLocale}
			profile={profiles.asumi}
			featured={featured}
			regular={regular}
			source="asumi"
			backLabel={{ 'pt-BR': '← Voltar ao site', en: '← Back to site' }}
		/>
	);
}
