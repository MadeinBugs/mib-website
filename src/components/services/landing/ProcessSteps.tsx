import type { Translations } from '@/lib/i18n';

interface ProcessStepsProps {
	t: Translations['services']['landing']['process'];
}

export default function ProcessSteps({ t }: ProcessStepsProps) {
	return (
		<section className="px-6 py-16 bg-service-bg-elevated/50">
			<div className="max-w-3xl mx-auto">
				<h2 className="text-2xl font-bold text-service-text-primary mb-10 text-center">
					{t.title}
				</h2>
				<div className="grid md:grid-cols-4 gap-6">
					{t.steps.map((step, i) => (
						<div key={i} className="text-center">
							<div className="w-10 h-10 rounded-full bg-service-accent text-white font-bold flex items-center justify-center mx-auto mb-3">
								{i + 1}
							</div>
							<h3 className="font-semibold text-service-text-primary mb-1">{step.title}</h3>
							<p className="text-sm text-service-text-secondary">{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
