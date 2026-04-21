import type { ServiceItem } from '../types';
import {
	DELIVERABLE_SOCIAL_ACCOUNTS,
	DELIVERABLE_CONTENT_PROCESS,
	DELIVERABLE_CONTENT_PLATFORMS,
	DELIVERABLE_APPROVAL_CHAIN,
} from '../deliverables';

export const socialMediaServices: ServiceItem[] = [
	// 8.1 Social Media Scheduler
	{
		id: 'social-scheduler',
		category: 'social-media',
		name: {
			en: 'Social Media Scheduler',
			'pt-BR': 'Agendador de Redes Sociais',
		},
		shortDescription: {
			en: 'Schedule posts across all your social platforms from a single dashboard. Plan your week, let it run itself.',
			'pt-BR': 'Agende posts em todas as suas redes sociais por um único painel. Planeje sua semana, deixe rodar sozinho.',
		},
		longDescription: {
			en: 'A self-hosted social media management tool connected to all your accounts. Schedule posts, preview across platforms, and manage your content calendar from one place. Supports Instagram, X, LinkedIn, Bluesky, YouTube, TikTok, and more.',
			'pt-BR': 'Uma ferramenta de gerenciamento de redes sociais self-hosted conectada a todas as suas contas. Agende posts, visualize em diferentes plataformas e gerencie seu calendário de conteúdo de um só lugar. Suporta Instagram, X, LinkedIn, Bluesky, YouTube, TikTok e mais.',
		},
		basePrice: { BRL: 800, USD: 185 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 1.5,
		configurations: [
			{
				id: 'hosting-choice',
				label: {
					en: 'Hosting',
					'pt-BR': 'Hospedagem',
				},
				type: 'single-select',
				required: true,
				defaultOptionId: 'self-hosted',
				options: [
					{
						id: 'self-hosted',
						label: {
							en: 'Self-hosted (Mixpost)',
							'pt-BR': 'Auto-hospedado (Mixpost)',
						},
						description: {
							en: 'Full control on your own server. No per-seat fees.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem cobrança por assento.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'buffer',
						label: {
							en: 'Buffer',
							'pt-BR': 'Buffer',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'hootsuite',
						label: {
							en: 'Hootsuite',
							'pt-BR': 'Hootsuite',
						},
						description: {
							en: 'Platform costs not included.',
							'pt-BR': 'Custos de plataforma não inclusos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'later',
						label: {
							en: 'Later',
							'pt-BR': 'Later',
						},
						description: {
							en: 'Platform costs not included.',
							'pt-BR': 'Custos de plataforma não inclusos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
				],
			},
		],
		clientDeliverables: [DELIVERABLE_SOCIAL_ACCOUNTS],
		active: true,
	},

	// 8.2 Content Workflow Automation
	{
		id: 'content-workflow',
		category: 'social-media',
		name: {
			en: 'Content Workflow Automation',
			'pt-BR': 'Automação de Fluxo de Conteúdo',
		},
		shortDescription: {
			en: 'Automated pipeline from content drafts to multi-platform publishing. Approvals, scheduling, and cross-posting handled for you. Base price covers a single simple workflow.',
			'pt-BR': 'Pipeline automatizado de rascunhos de conteúdo para publicação em múltiplas plataformas. Aprovações, agendamento e cross-posting cuidados para você. Preço base cobre um fluxo simples.',
		},
		longDescription: {
			en: 'Automated pipeline from content drafts to multi-platform publishing. Approvals, scheduling, and cross-posting handled for you. Base price covers a single simple workflow. Complex flows with conditional logic, multiple approval stages, or many platforms are quoted after review.',
			'pt-BR': 'Pipeline automatizado de rascunhos de conteúdo para publicação em múltiplas plataformas. Aprovações, agendamento e cross-posting cuidados para você. Preço base cobre um fluxo simples. Fluxos complexos com lógica condicional, múltiplas etapas de aprovação ou muitas plataformas são orçados após análise.',
		},
		basePrice: { BRL: 900, USD: 210 },
		maintenance: {
			price: { BRL: 120, USD: 28 },
		},
		estimatedSetupDays: 5,
		requires: ['automation-platform', 'social-scheduler'],
		customFields: [
			{
				id: 'content-flows',
				label: {
					en: 'Describe each content workflow you want automated',
					'pt-BR': 'Descreva cada fluxo de conteúdo que você quer automatizar',
				},
				placeholder: {
					en: 'e.g., "Our writer drafts in Notion, I approve, then it publishes to Instagram + LinkedIn + our blog on a weekly schedule" — each flow typically ranges R$ 300 (simple cross-post) to R$ 1,200 (multi-stage with approvals and conditional logic)',
					'pt-BR': 'ex: "Nosso redator escreve no Notion, eu aprovo, depois publica no Instagram + LinkedIn + nosso blog em um cronograma semanal" — cada fluxo tipicamente varia de R$ 300 (cross-post simples) a R$ 1.200 (multi-estágio com aprovações e lógica condicional)',
				},
				type: 'textarea',
				repeatable: true,
				pendingPricing: true,
				minItems: 1,
				maxItems: 5,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [
			DELIVERABLE_CONTENT_PROCESS,
			DELIVERABLE_CONTENT_PLATFORMS,
			DELIVERABLE_APPROVAL_CHAIN,
		],
		active: true,
	},
];
