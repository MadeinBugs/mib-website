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
		title: isPt
			? 'Asumi: Little Ones — Links Oficiais | Made in Bugs'
			: 'Asumi: Little Ones — Official Links | Made in Bugs',
		description: isPt
			? 'Links oficiais do jogo Asumi: Little Ones — siga nas redes, entre no Discord e acompanhe as novidades do cozy game brasileiro.'
			: 'Official Asumi: Little Ones links — follow on social media, join Discord, and stay updated on the Brazilian cozy game.',
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
			title: isPt
				? 'Asumi: Little Ones — Links Oficiais'
				: 'Asumi: Little Ones — Official Links',
			description: isPt
				? 'Todos os links do jogo Asumi: redes sociais, Discord, newsletter e mais.'
				: 'All Asumi game links: social media, Discord, newsletter and more.',
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
			title: isPt
				? 'Asumi: Little Ones — Links Oficiais'
				: 'Asumi: Little Ones — Official Links',
			description: isPt
				? 'Todos os links do jogo Asumi: redes sociais, Discord, newsletter e mais.'
				: 'All Asumi game links: social media, Discord, newsletter and more.',
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
			profile={profiles.asumi}
			featured={featured}
			regular={regular}
			source="asumi"
		/>
	);
}
