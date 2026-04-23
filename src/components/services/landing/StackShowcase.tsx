import type { Translations } from '@/lib/i18n';

interface StackShowcaseProps {
	t: Translations['services']['landing']['stack'];
}

const TOOLS = ['Umami Analytics', 'n8n Automation', 'Twenty CRM', 'Uptime Kuma', 'Cal.com', 'Shlink'];

export default function StackShowcase({ t }: StackShowcaseProps) {
	return (
		<section className="px-6 py-16">
			<div className="max-w-4xl mx-auto text-center">
				<h2 className="text-2xl font-bold text-service-text-primary mb-4">
					{t.title}
				</h2>
				<p className="text-service-text-secondary mb-8">
					{t.subtitle}
				</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-service-text-secondary">
					{TOOLS.map((tool) => (
						<div key={tool} className="p-4 bg-service-bg-elevated rounded-lg border border-service-border">
							{tool}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
