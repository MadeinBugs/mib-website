import Link from 'next/link';
import type { Translations } from '@/lib/i18n';

interface CallToActionProps {
	locale: string;
	t: Translations['services']['landing']['cta'];
}

export default function CallToAction({ locale, t }: CallToActionProps) {
	return (
		<section className="px-6 py-20 text-center">
			<h2 className="text-2xl font-bold text-service-text-primary mb-6">
				{t.title}
			</h2>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Link
					href={`/${locale}/services/infra-builder`}
					className="inline-block px-8 py-4 bg-service-accent text-white font-bold text-lg rounded-lg hover:bg-service-accent-hover transition-colors shadow-lg"
				>
					{t.ctaPrimary}
				</Link>
				<a
					href="https://agenda.madeinbugs.com.br/andressmartin/consultoria-infraestrutura"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block px-8 py-4 border-2 border-service-border-strong text-service-text-secondary font-semibold text-lg rounded-lg hover:bg-service-bg-elevated transition-colors"
					data-umami-event="cta_talk_to_us_clicked"
					data-umami-event-source="landing_footer"
				>
					{t.ctaSecondary}
				</a>
			</div>
		</section>
	);
}
