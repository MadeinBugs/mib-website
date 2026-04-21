import type { ServiceItem } from '../types';
import {
	DELIVERABLE_STUDIO_BRANDING,
	DELIVERABLE_PROJECT_SHOWCASE,
	DELIVERABLE_WEBSITE_COPY,
	DELIVERABLE_CONTACT_EMAIL,
	DELIVERABLE_PRESS_STUDIO_INFO,
	DELIVERABLE_PRESS_GAME_INFO,
	DELIVERABLE_PRESS_ASSETS,
	DELIVERABLE_PRESS_CONTACT,
	DELIVERABLE_PLAYTEST_FORM_FIELDS,
	DELIVERABLE_TRIAGE_CRITERIA,
	DELIVERABLE_ACCESS_DELIVERY_METHOD,
	DELIVERABLE_WELCOME_EMAIL_CONTENT,
	DELIVERABLE_COMMUNITY_ADMIN_ACCESS,
	DELIVERABLE_COMMUNITY_BRANDING,
	DELIVERABLE_ROLE_STRUCTURE,
} from '../deliverables';

export const webGamedevServices: ServiceItem[] = [
	// 9.1 Studio Website
	{
		id: 'studio-website',
		category: 'web-gamedev',
		name: {
			en: 'Studio Website',
			'pt-BR': 'Site do Estúdio',
		},
		shortDescription: {
			en: "A one-page studio site with your branding, project showcase, press kit link, and contact form. Fast, modern, bilingual if you want it.",
			'pt-BR': 'Um site de uma página com sua marca, vitrine de projetos, link para press kit e formulário de contato. Rápido, moderno, bilíngue se você quiser.',
		},
		longDescription: {
			en: "A custom-built studio website with your branding, project showcase, and contact form. Fast, modern, and optimized for SEO. Base price covers a single-page site in one language. Bilingual, multi-page, blog sections, and interactive elements are quoted after review.",
			'pt-BR': 'Um site customizado do estúdio com sua marca, vitrine de projetos e formulário de contato. Rápido, moderno e otimizado para SEO. Preço base cobre um site de uma página em um idioma. Bilíngue, multi-página, seções de blog e elementos interativos são orçados após análise.',
		},
		basePrice: { BRL: 2000, USD: 460 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 7,
		requires: ['cloud-server', 'domain-setup'],
		recommends: ['mailing-list', 'web-analytics'],
		configurations: [
			{
				id: 'website-languages',
				label: {
					en: 'Language Support',
					'pt-BR': 'Suporte de Idiomas',
				},
				type: 'single-select',
				required: true,
				defaultOptionId: 'one-language',
				options: [
					{
						id: 'one-language',
						label: {
							en: 'One language',
							'pt-BR': 'Um idioma',
						},
						description: {
							en: 'English OR Portuguese.',
							'pt-BR': 'Inglês OU Português.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'bilingual',
						label: {
							en: 'Bilingual (EN + PT-BR)',
							'pt-BR': 'Bilíngue (EN + PT-BR)',
						},
						description: {
							en: 'Both languages, full translation.',
							'pt-BR': 'Ambos os idiomas, tradução completa.',
						},
						priceModifier: { BRL: 600, USD: 140 },
					},
					{
						id: 'multi-language',
						label: {
							en: 'More than two languages',
							'pt-BR': 'Mais de dois idiomas',
						},
						description: {
							en: 'Quoted per language after review (pending pricing).',
							'pt-BR': 'Orçado por idioma após análise (preço pendente).',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
				],
			},
		],
		customFields: [
			{
				id: 'website-scope',
				label: {
					en: 'Describe your studio and any special needs',
					'pt-BR': 'Descreva seu estúdio e quaisquer necessidades especiais',
				},
				placeholder: {
					en: 'e.g., "2-person studio, 3 games to showcase, need bilingual EN/PT-BR, want a simple blog section" — a blog or multiple pages typically adds R$ 800–1,500; complex interactive elements or custom animations add R$ 1,000–3,000',
					'pt-BR': 'ex: "Estúdio de 2 pessoas, 3 jogos para mostrar, precisa ser bilíngue EN/PT-BR, quero uma seção de blog simples" — blog ou múltiplas páginas tipicamente adiciona R$ 800–1.500; elementos interativos complexos ou animações customizadas adicionam R$ 1.000–3.000',
				},
				type: 'textarea',
				repeatable: false,
				pendingPricing: true,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [
			DELIVERABLE_STUDIO_BRANDING,
			DELIVERABLE_PROJECT_SHOWCASE,
			DELIVERABLE_WEBSITE_COPY,
			DELIVERABLE_CONTACT_EMAIL,
		],
		active: true,
	},

	// 9.2 Press Kit Hosting
	{
		id: 'press-kit',
		category: 'web-gamedev',
		name: {
			en: 'Press Kit Page',
			'pt-BR': 'Página de Press Kit',
		},
		shortDescription: {
			en: "A dedicated, downloadable press kit for journalists and content creators. Screenshots, logos, studio info, fact sheet — everything they need in one organized page.",
			'pt-BR': 'Um press kit dedicado e com download para jornalistas e criadores de conteúdo. Screenshots, logos, info do estúdio, fact sheet — tudo que eles precisam em uma página organizada.',
		},
		longDescription: {
			en: "A professional press kit page hosted on your domain. Organized sections for studio info, game details, screenshots, key art, logos, and fact sheets — all downloadable in high resolution. Perfect for festivals, press outreach, and publisher meetings.",
			'pt-BR': 'Uma página profissional de press kit hospedada no seu domínio. Seções organizadas para info do estúdio, detalhes dos jogos, screenshots, key art, logos e fact sheets — tudo com download em alta resolução. Perfeito para festivais, contato com imprensa e reuniões com publishers.',
		},
		basePrice: { BRL: 800, USD: 185 },
		maintenance: {
			price: { BRL: 60, USD: 14 },
		},
		estimatedSetupDays: 2,
		requires: ['cloud-server', 'domain-setup'],
		recommends: ['url-shortener', 'web-analytics'],
		clientDeliverables: [
			DELIVERABLE_PRESS_STUDIO_INFO,
			DELIVERABLE_PRESS_GAME_INFO,
			DELIVERABLE_PRESS_ASSETS,
			DELIVERABLE_PRESS_CONTACT,
		],
		active: true,
	},

	// 9.3 Playtest Recruitment Pipeline
	{
		id: 'playtest-recruitment',
		category: 'web-gamedev',
		name: {
			en: 'Playtest Recruitment Pipeline',
			'pt-BR': 'Pipeline de Recrutamento de Playtest',
		},
		shortDescription: {
			en: 'Collect playtest signups through a branded form, automatically triage testers, and send access codes or download links. Perfect for running demos and closed betas.',
			'pt-BR': 'Receba inscrições de playtest por um formulário com sua marca, faça triagem automática e envie códigos de acesso ou links de download. Perfeito para demos e betas fechados.',
		},
		longDescription: {
			en: 'A complete playtest recruitment pipeline: branded signup form, automatic triage based on your criteria, transactional emails with access codes or download links, and a dashboard to manage your tester pool. Perfect for Steam Next Fest, closed betas, and demo launches.',
			'pt-BR': 'Um pipeline completo de recrutamento de playtest: formulário de inscrição com sua marca, triagem automática baseada nos seus critérios, emails transacionais com códigos de acesso ou links de download e um dashboard para gerenciar seu pool de testers. Perfeito para Steam Next Fest, betas fechados e lançamentos de demo.',
		},
		basePrice: { BRL: 1200, USD: 280 },
		maintenance: {
			price: { BRL: 120, USD: 28 },
		},
		estimatedSetupDays: 3,
		requires: ['cloud-server', 'transactional-email'],
		recommends: ['crm-setup'],
		clientDeliverables: [
			DELIVERABLE_PLAYTEST_FORM_FIELDS,
			DELIVERABLE_TRIAGE_CRITERIA,
			DELIVERABLE_WELCOME_EMAIL_CONTENT,
			DELIVERABLE_ACCESS_DELIVERY_METHOD,
		],
		active: true,
	},

	// 9.4 Community Platform Setup
	{
		id: 'community-platform',
		category: 'web-gamedev',
		name: {
			en: 'Community Platform Setup',
			'pt-BR': 'Configuração de Plataforma de Comunidade',
		},
		shortDescription: {
			en: "Your studio's Discord (or similar) set up professionally with roles, channels, moderation, welcome flow, and optional website integration.",
			'pt-BR': 'O Discord do seu estúdio (ou similar) configurado profissionalmente com cargos, canais, moderação, fluxo de boas-vindas e integração opcional com o site.',
		},
		longDescription: {
			en: "Professional setup of your community platform with roles, channels, moderation rules, welcome flow, and optional website role sync. We handle everything from channel structure to automated welcome messages and role assignment.",
			'pt-BR': 'Configuração profissional da sua plataforma de comunidade com cargos, canais, regras de moderação, fluxo de boas-vindas e sincronização opcional de cargos com o site. Cuidamos de tudo, da estrutura de canais às mensagens automatizadas de boas-vindas e atribuição de cargos.',
		},
		basePrice: { BRL: 900, USD: 210 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 4,
		configurations: [
			{
				id: 'community-platform-type',
				label: {
					en: 'Platform',
					'pt-BR': 'Plataforma',
				},
				type: 'single-select',
				required: true,
				defaultOptionId: 'discord',
				options: [
					{
						id: 'discord',
						label: {
							en: 'Discord',
							'pt-BR': 'Discord',
						},
						description: {
							en: 'Most common for game studios.',
							'pt-BR': 'Mais comum para estúdios de jogos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'other',
						label: {
							en: 'Other (Slack, Revolt, Guilded, etc.)',
							'pt-BR': 'Outro (Slack, Revolt, Guilded, etc.)',
						},
						description: {
							en: 'Tell us which in the description.',
							'pt-BR': 'Nos diga qual na descrição.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
				],
			},
			{
				id: 'website-integration',
				label: {
					en: 'Website Integration',
					'pt-BR': 'Integração com Site',
				},
				type: 'single-select',
				required: true,
				defaultOptionId: 'none',
				options: [
					{
						id: 'none',
						label: {
							en: 'None — standalone community',
							'pt-BR': 'Nenhuma — comunidade independente',
						},
						description: {
							en: 'Discord setup only; no sync with a website.',
							'pt-BR': 'Setup de Discord apenas; sem sincronização com site.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'website-sync',
						label: {
							en: 'Sync roles with studio website',
							'pt-BR': 'Sincronizar cargos com site do estúdio',
						},
						description: {
							en: 'Automatically assigns roles based on website accounts; requires your website and server in the same package.',
							'pt-BR': 'Atribui cargos automaticamente baseado em contas do site; requer seu site e servidor no mesmo pacote.',
						},
						priceModifier: { BRL: 400, USD: 95 },
						additionalRequires: ['cloud-server', 'studio-website'],
					},
				],
			},
		],
		customFields: [
			{
				id: 'community-scope',
				label: {
					en: 'Describe your community needs',
					'pt-BR': 'Descreva suas necessidades de comunidade',
				},
				placeholder: {
					en: 'e.g., "Discord server with 3 role tiers, welcome bot, moderation rules, and auto-role assignment when someone signs up on our website" — website role sync typically adds R$ 400; custom bots add R$ 300–1,000 depending on features',
					'pt-BR': 'ex: "Servidor Discord com 3 níveis de cargo, bot de boas-vindas, regras de moderação e atribuição automática de cargo quando alguém se cadastra no nosso site" — sincronização de cargos com o site tipicamente adiciona R$ 400; bots customizados adicionam R$ 300–1.000 dependendo das funcionalidades',
				},
				type: 'textarea',
				repeatable: false,
				pendingPricing: true,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [
			DELIVERABLE_COMMUNITY_ADMIN_ACCESS,
			DELIVERABLE_COMMUNITY_BRANDING,
			DELIVERABLE_ROLE_STRUCTURE,
		],
		active: true,
	},
];
