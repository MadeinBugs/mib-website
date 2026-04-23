import type { Translations } from '@/lib/i18n';

interface ProblemStatementProps {
	t: Translations['services']['landing']['problem'];
}

export default function ProblemStatement({ t }: ProblemStatementProps) {
	return (
		<section className="px-6 py-16 bg-service-bg-elevated/50">
			<div className="max-w-3xl mx-auto">
				<h2 className="text-2xl font-bold text-service-text-primary mb-6 text-center">
					{t.title}
				</h2>
				<ul className="space-y-4 text-service-text-secondary">
					{t.items.map((item, i) => (
						<li key={i} className="flex items-start gap-3">
							<span className="text-red-400 mt-1">✕</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
