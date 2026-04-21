import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import ContentLayout from '../../../components/ContentLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en' ? 'Terms of Service — Made in Bugs' : 'Termos de Serviço — Made in Bugs',
	};
}

export default async function TermsIndexPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	const sections = [
		{
			href: `/${locale}/terms/services`,
			emoji: '🏗️',
			title: locale === 'en' ? 'B2B Infrastructure Services' : 'Serviços de Infraestrutura B2B',
			description: locale === 'en'
				? 'Terms governing the Infra Builder quote system and B2B service engagements.'
				: 'Termos que regem o sistema de orçamentos do Infra Builder e prestação de serviços B2B.',
		},
		{
			href: `/${locale}/terms/social-media-tool`,
			emoji: '📱',
			title: locale === 'en' ? 'Social Media Management Tool' : 'Ferramenta de Gestão de Mídias Sociais',
			description: locale === 'en'
				? 'Terms for the internal social media scheduling and management tool.'
				: 'Termos da ferramenta interna de agendamento e gestão de mídias sociais.',
		},
		{
			href: `/${locale}/terms/newsletter`,
			emoji: '📬',
			title: locale === 'en' ? 'Newsletter' : 'Newsletter',
			description: locale === 'en'
				? 'Terms for our Bugsletter email communications.'
				: 'Termos das comunicações da nossa Bugsletter.',
		},
	];

	return (
		<ContentLayout translations={t} locale={locale}>
			<main className="min-h-screen py-16 px-6">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						{locale === 'en' ? 'Terms of Service' : 'Termos de Serviço'}
					</h1>
					<p className="text-neutral-600 mb-10">
						{locale === 'en'
							? 'Select the terms applicable to the product or service you are using.'
							: 'Selecione os termos aplicáveis ao produto ou serviço que você está utilizando.'}
					</p>

					<div className="space-y-4">
						{sections.map((section) => (
							<Link
								key={section.href}
								href={section.href}
								className="block p-6 rounded-lg border border-neutral-200 hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
							>
								<div className="flex items-start gap-4">
									<span className="text-2xl group-hover:scale-110 transition-transform duration-200">
										{section.emoji}
									</span>
									<div>
										<h2 className="text-lg font-semibold text-neutral-800 group-hover:text-amber-700 transition-colors">
											{section.title}
										</h2>
										<p className="text-sm text-neutral-500 mt-1">
											{section.description}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
