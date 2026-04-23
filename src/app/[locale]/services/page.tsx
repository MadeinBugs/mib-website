import { getTranslations, normalizeLocale } from '@/lib/i18n';
import Link from 'next/link';
import HeroSection from '@/components/services/landing/HeroSection';
import ProblemStatement from '@/components/services/landing/ProblemStatement';
import CategoryGrid from '@/components/services/landing/CategoryGrid';
import ProcessSteps from '@/components/services/landing/ProcessSteps';
import StackShowcase from '@/components/services/landing/StackShowcase';
import CallToAction from '@/components/services/landing/CallToAction';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const isLive = process.env.SERVICES_FEATURE_LIVE === 'true';
	const t = await getTranslations(locale);
	const landing = t.services.landing;

	if (!isLive) {
		return (
			<div className="flex items-center justify-center p-6 min-h-[60vh]">
				<div className="max-w-lg text-center">
					<h1 className="text-4xl font-bold text-service-text-primary mb-4">
						{landing.comingSoon.title}
					</h1>
					<p className="text-lg text-service-text-secondary mb-8">
						{landing.comingSoon.description}
					</p>
					<Link
						href={`/${locale}`}
						className="inline-block px-6 py-3 bg-service-accent text-white font-semibold rounded-lg hover:bg-service-accent-hover transition-colors"
					>
						{landing.comingSoon.backHome}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div>
			<HeroSection locale={locale} t={landing.hero} />
			<ProblemStatement t={landing.problem} />
			<CategoryGrid locale={locale} t={landing.categories} />
			<ProcessSteps t={landing.process} />
			<StackShowcase t={landing.stack} />
			<CallToAction locale={locale} t={landing.cta} />
		</div>
	);
}
