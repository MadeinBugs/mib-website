import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://madeinbugs.com.br';

const locales = ['pt-BR', 'en'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes = [
		'',
		'/about',
		'/portfolio',
		'/contact',
		'/links',
	];

	const serviceRoutes = process.env.SERVICES_FEATURE_LIVE === 'true'
		? ['/services', '/services/infra-builder']
		: [];

	const allRoutes = [...staticRoutes, ...serviceRoutes];

	return locales.flatMap((locale) =>
		allRoutes.map((route) => ({
			url: `${BASE_URL}/${locale}${route}`,
			lastModified: new Date(),
			changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
			priority: route === '' ? 1 : route === '/services' ? 0.9 : 0.8,
		}))
	);
}
