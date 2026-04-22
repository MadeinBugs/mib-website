import { normalizeLocale } from '@/lib/i18n';
import Link from 'next/link';
import { FaServer, FaRocket, FaBolt, FaClipboardList, FaEnvelope, FaChartBar, FaWrench, FaMobileAlt, FaGamepad } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const isLive = process.env.SERVICES_FEATURE_LIVE === 'true';

	if (!isLive) {
		return (
			<div className="flex items-center justify-center p-6 min-h-[60vh]">
				<div className="max-w-lg text-center">
					<h1 className="text-4xl font-bold text-service-text-primary mb-4">
						{locale === 'pt-BR' ? 'Em breve' : 'Coming Soon'}
					</h1>
					<p className="text-lg text-service-text-secondary mb-8">
						{locale === 'pt-BR'
							? 'Estamos preparando nosso builder de infraestrutura. Fique de olho!'
							: "We're preparing our infrastructure builder. Stay tuned!"}
					</p>
					<Link
						href={`/${locale}`}
						className="inline-block px-6 py-3 bg-service-accent text-white font-semibold rounded-lg hover:bg-service-accent-hover transition-colors"
					>
						{locale === 'pt-BR' ? '← Voltar ao início' : '← Back to home'}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div>

			{/* Hero Section */}
			<section className="px-6 py-20 max-w-5xl mx-auto text-center">
				<h1 className="text-4xl md:text-5xl font-bold text-service-text-primary mb-6">
					{locale === 'pt-BR'
						? 'Monte a infraestrutura do seu estúdio, sem a dor de cabeça do setup'
						: 'Set up your studio\'s infrastructure, without the setup'}
				</h1>
				<p className="text-lg text-service-text-secondary max-w-2xl mx-auto mb-10">
					{locale === 'pt-BR'
						? 'Escolha os serviços que você precisa, configure, veja o preço ao vivo e envie um pedido de orçamento — tudo em um só lugar.'
						: 'Choose the services you need, configure them, see live pricing, and submit a quote request — all in one place.'}
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href={`/${locale}/services/infra-builder`}
						className="inline-block px-8 py-4 bg-service-accent text-white font-bold text-lg rounded-lg hover:bg-service-accent-hover transition-colors shadow-lg"
					>
						{locale === 'pt-BR' ? 'Montar meu pacote' : 'Build my package'}
					</Link>
					<a
						href="https://agenda.madeinbugs.com.br/andressmartin/consultoria-infraestrutura"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block px-8 py-4 border-2 border-service-border-strong text-service-text-secondary font-semibold text-lg rounded-lg hover:bg-service-bg-elevated transition-colors"
					>
						{locale === 'pt-BR' ? 'Não sabe o que precisa? Fale com a gente' : 'Not sure what you need? Talk to us'}
					</a>
				</div>
			</section>

			{/* Problem Statement */}
			<section className="px-6 py-16 bg-service-bg-elevated/50">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-service-text-primary mb-6 text-center">
						{locale === 'pt-BR' ? 'A dor que você já conhece' : 'The pain you already know'}
					</h2>
					<ul className="space-y-4 text-service-text-secondary">
						{(locale === 'pt-BR'
							? [
								'Configurar CI/CD, CRM, lista de emails e analytics individualmente leva semanas',
								'Cada ferramenta tem sua própria conta, fatura e painel de controle',
								'Sem um DevOps dedicado, a infraestrutura acumula dívida técnica silenciosamente',
								'Plataformas SaaS cobram por assento — os custos escalam com a equipe',
							]
							: [
								'Setting up CI/CD, CRM, mailing list, and analytics individually takes weeks',
								'Each tool has its own account, billing, and dashboard',
								'Without dedicated DevOps, infrastructure silently accumulates tech debt',
								'SaaS platforms charge per seat — costs scale with your team',
							]
						).map((item, i) => (
							<li key={i} className="flex items-start gap-3">
								<span className="text-red-400 mt-1">✕</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* What We Offer */}
			<section className="px-6 py-16">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-2xl font-bold text-service-text-primary mb-10 text-center">
						{locale === 'pt-BR' ? 'O que oferecemos' : 'What we offer'}
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
						{([
							{ key: 'infrastructure', en: 'Infrastructure', pt: 'Infraestrutura', Icon: FaServer },
							{ key: 'cicd', en: 'Code & Delivery', pt: 'Código & Entrega', Icon: FaRocket },
							{ key: 'automation', en: 'Automation', pt: 'Automação', Icon: FaBolt },
							{ key: 'crm', en: 'CRM & Scheduling', pt: 'CRM & Agendamento', Icon: FaClipboardList },
							{ key: 'marketing', en: 'Marketing & Email', pt: 'Marketing & Email', Icon: FaEnvelope },
							{ key: 'analytics', en: 'Analytics & Insights', pt: 'Analytics & Insights', Icon: FaChartBar },
							{ key: 'team-management', en: 'Team Management', pt: 'Gestão de Equipe', Icon: FaWrench },
							{ key: 'social-media', en: 'Social Media', pt: 'Redes Sociais', Icon: FaMobileAlt },
							{ key: 'web-gamedev', en: 'Web & Gamedev', pt: 'Web & Gamedev', Icon: FaGamepad },
						] as Array<{ key: string; en: string; pt: string; Icon: IconType }>).map((cat) => (
							<Link
								key={cat.key}
								href={`/${locale}/services/infra-builder?category=${cat.key}`}
								className="p-4 bg-service-bg-elevated rounded-xl border-2 border-service-border hover:border-service-accent transition-colors text-center"
							>
								<cat.Icon className="text-3xl mx-auto mb-2 text-service-accent" />
								<span className="font-semibold text-service-text-primary text-sm">
									{locale === 'pt-BR' ? cat.pt : cat.en}
								</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="px-6 py-16 bg-service-bg-elevated/50">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-service-text-primary mb-10 text-center">
						{locale === 'pt-BR' ? 'Como funciona' : 'How it works'}
					</h2>
					<div className="grid md:grid-cols-4 gap-6">
						{(locale === 'pt-BR'
							? [
								{ step: '1', title: 'Monte seu pacote', desc: 'Escolha serviços e configure' },
								{ step: '2', title: 'Envie o orçamento', desc: 'Revise e envie' },
								{ step: '3', title: 'Respondemos em 2-3 dias', desc: 'Com preço final' },
								{ step: '4', title: 'A gente monta tudo', desc: 'Setup de ponta a ponta' },
							]
							: [
								{ step: '1', title: 'Build your package', desc: 'Choose services and configure' },
								{ step: '2', title: 'Submit quote', desc: 'Review and submit' },
								{ step: '3', title: 'We respond in 2-3 days', desc: 'With final pricing' },
								{ step: '4', title: 'We set it up end-to-end', desc: 'Full setup handled' },
							]
						).map((item) => (
							<div key={item.step} className="text-center">
								<div className="w-10 h-10 rounded-full bg-service-accent text-white font-bold flex items-center justify-center mx-auto mb-3">
									{item.step}
								</div>
								<h3 className="font-semibold text-service-text-primary mb-1">{item.title}</h3>
								<p className="text-sm text-service-text-secondary">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stack Showcase */}
			<section className="px-6 py-16">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl font-bold text-service-text-primary mb-4">
						{locale === 'pt-BR' ? 'Veja em ação' : 'See it in action'}
					</h2>
					<p className="text-service-text-secondary mb-8">
						{locale === 'pt-BR'
							? 'Essa é a nossa própria infraestrutura. A gente usa o que vende.'
							: 'This is our own infrastructure. We eat our own cooking.'}
					</p>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-service-text-secondary">
						{['Umami Analytics', 'n8n Automation', 'Twenty CRM', 'Uptime Kuma', 'Cal.com', 'Shlink'].map((tool) => (
							<div key={tool} className="p-4 bg-service-bg-elevated rounded-lg border border-service-border">
								{tool}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="px-6 py-20 text-center">
				<h2 className="text-3xl font-bold text-service-text-primary mb-6">
					{locale === 'pt-BR'
						? 'Pronto para parar de manter infraestrutura?'
						: 'Ready to stop maintaining infrastructure?'}
				</h2>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href={`/${locale}/services/infra-builder`}
						className="inline-block px-8 py-4 bg-service-accent text-white font-bold text-lg rounded-lg hover:bg-service-accent-hover transition-colors shadow-lg"
					>
						{locale === 'pt-BR' ? 'Montar meu pacote' : 'Build my package'}
					</Link>
					<a
						href="https://agenda.madeinbugs.com.br/andressmartin/consultoria-infraestrutura"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block px-8 py-4 border-2 border-service-border-strong text-service-text-secondary font-semibold text-lg rounded-lg hover:bg-service-bg-elevated transition-colors"
					>
						{locale === 'pt-BR' ? 'Ou fale com a gente primeiro' : 'Or talk to us first'}
					</a>
				</div>
			</section>
		</div>
	);
}
