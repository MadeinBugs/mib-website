import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import { getProjectById, projectsDatabase } from '../../../../lib/projects';
import ProjectPageClient from './ProjectPageClient';

const SITE_URL = 'https://www.madeinbugs.com.br';

interface Props {
	params: Promise<{ locale: string; projectId: string }>;
}

// Generate static params for all locale/project combinations
export async function generateStaticParams() {
	const locales = ['en', 'pt-BR'];
	const params = [];

	for (const locale of locales) {
		for (const project of projectsDatabase) {
			if (!project.hide) { // Only include non-hidden projects
				params.push({
					locale: locale,
					projectId: project.id,
				});
			}
		}
	}

	return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale: rawLocale, projectId } = await params;
	const locale = normalizeLocale(rawLocale) as 'en' | 'pt-BR';
	const project = getProjectById(projectId);

	if (!project) {
		return {};
	}

	const title = project.title[locale] || project.title['en'];
	const subtitle = project.subtitle[locale] || project.subtitle['en'];
	const description = project.description?.[locale] || project.description?.['en'] || subtitle;
	const fullTitle = `${title} - Made in Bugs`;

	// Pick the best image: bannerImage > first 'both'/'thumbnail' image > first image
	const ogImage = project.bannerImage
		|| project.images.find(img => img.type === 'both' || img.type === 'thumbnail')?.src
		|| project.images[0]?.src;

	const pageUrl = `${SITE_URL}/${rawLocale}/projects/${projectId}`;

	return {
		title: fullTitle,
		description,
		openGraph: {
			title: fullTitle,
			description,
			url: pageUrl,
			siteName: 'Made in Bugs',
			type: 'website',
			locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
			...(ogImage && {
				images: [
					{
						url: `${SITE_URL}${ogImage}`,
						width: 1200,
						height: 630,
						alt: title,
					},
				],
			}),
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description,
			...(ogImage && {
				images: [`${SITE_URL}${ogImage}`],
			}),
		},
	};
}

export default async function ProjectPage({ params }: Props) {
	const { locale: rawLocale, projectId } = await params;
	const locale = normalizeLocale(rawLocale);

	// Load translations
	const t = await getTranslations(locale);

	// Get project data
	const project = getProjectById(projectId);

	if (!project) {
		notFound();
	}

	return <ProjectPageClient project={project} locale={locale} translations={t} />;
}
