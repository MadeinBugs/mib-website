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
		title: locale === 'en' ? 'Privacy Policy — Made in Bugs' : 'Política de Privacidade — Made in Bugs',
	};
}

export default async function PrivacyIndexPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	const sections = [
		{
			href: `/${locale}/privacy/services`,
			emoji: '🏗️',
			title: locale === 'en' ? 'B2B Infrastructure Services' : 'Serviços de Infraestrutura B2B',
			description: locale === 'en'
				? 'How we handle data collected through the Infra Builder and B2B service engagements.'
				: 'Como tratamos dados coletados pelo Infra Builder e prestação de serviços B2B.',
		},
		{
			href: `/${locale}/privacy/social-media-tool`,
			emoji: '📱',
			title: locale === 'en' ? 'Social Media Management Tool' : 'Ferramenta de Gestão de Mídias Sociais',
			description: locale === 'en'
				? 'Privacy policy for the internal social media scheduling and management tool.'
				: 'Política de privacidade da ferramenta interna de agendamento e gestão de mídias sociais.',
		},
		{
			href: `/${locale}/privacy/newsletter`,
			emoji: '📬',
			title: locale === 'en' ? 'Newsletter' : 'Newsletter',
			description: locale === 'en'
				? 'How we handle subscriber data for our Bugsletter.'
				: 'Como tratamos dados de assinantes da nossa Bugsletter.',
		},
	];

	return (
		<ContentLayout translations={t} locale={locale}>
			<main className="min-h-screen py-16 px-6">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						{locale === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}
					</h1>
					<p className="text-neutral-600 mb-10">
						{locale === 'en'
							? 'Select the privacy policy applicable to the product or service you are using.'
							: 'Selecione a política de privacidade aplicável ao produto ou serviço que você está utilizando.'}
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
