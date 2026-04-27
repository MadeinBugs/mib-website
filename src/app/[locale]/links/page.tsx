import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/i18n';
import { links } from '@/lib/links/data';
import { profiles } from '@/lib/links/profiles';
import LinksHub from '@/components/links/LinksHub';

const SITE_URL = 'https://www.madeinbugs.com.br';
const OG_IMAGE_PATH = '/assets/links/links-og.jpg';

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
		title: 'Links — Made in Bugs',
		description: isPt
			? 'Todos os links oficiais do estúdio Made in Bugs.'
			: 'All official links from Made in Bugs studio.',
		alternates: {
			canonical: `${SITE_URL}/${locale}/links`,
			languages: {
				'pt-BR': `${SITE_URL}/pt-BR/links`,
				en: `${SITE_URL}/en/links`,
			},
		},
		openGraph: {
			type: 'website',
			url: `${SITE_URL}/${locale}/links`,
			siteName: 'Made in Bugs',
			images: [
				{
					url: `${SITE_URL}${OG_IMAGE_PATH}`,
					width: 1200,
					height: 630,
					alt: 'Made in Bugs — Links',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: 'Links — Made in Bugs',
			description: isPt
				? 'Todos os links oficiais do estúdio Made in Bugs.'
				: 'All official links from Made in Bugs studio.',
			images: [`${SITE_URL}${OG_IMAGE_PATH}`],
		},
	};
}

export default async function LinksPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);

	const studioLinks = links.filter(
		(link) => link.scope === 'studio' || link.scope === 'both'
	);
	const featured = studioLinks.filter((l) => l.featured);
	const regular = studioLinks.filter((l) => !l.featured);

	return (
		<LinksHub
			locale={locale}
			profile={profiles.studio}
			featured={featured}
			regular={regular}
			source="studio"
		/>
	);
}
