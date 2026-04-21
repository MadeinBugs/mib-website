import type { ServiceItem } from '../types';
import {
	DELIVERABLE_CLOUD_PAYMENT,
	DELIVERABLE_CONFIRMED_DOMAIN,
	DELIVERABLE_DOMAIN,
	DELIVERABLE_DOMAIN_REGISTRAR_ACCESS,
	DELIVERABLE_LOGO_BRANDING,
} from '../deliverables';
import {
	COST_CLOUD_SMALL,
	COST_CLOUD_MEDIUM,
	COST_CLOUD_LARGE,
	COST_DOMAIN_REGISTRATION,
} from '../third-party-costs';

export const infrastructureServices: ServiceItem[] = [
	// 1.1 Cloud Server
	{
		id: 'cloud-server',
		category: 'infrastructure',
		name: {
			en: 'Cloud Server with Custom Domain',
			'pt-BR': 'Servidor na Nuvem com Domínio Customizado',
		},
		shortDescription: {
			en: 'A cloud server accessible from anywhere via your own domain. Foundation for all self-hosted tools.',
			'pt-BR': 'Um servidor na nuvem acessível de qualquer lugar pelo seu próprio domínio. Base para todas as ferramentas self-hosted.',
		},
		longDescription: {
			en: 'Your own cloud server, configured from scratch with best practices for security, performance, and reliability. Accessible via your custom domain with HTTPS. This is the foundation that powers all other self-hosted services in your package — CRM, analytics, automation, and more all run here.',
			'pt-BR': 'Seu próprio servidor na nuvem, configurado do zero com boas práticas de segurança, performance e confiabilidade. Acessível pelo seu domínio customizado com HTTPS. Esta é a base que alimenta todos os outros serviços self-hosted do seu pacote — CRM, analytics, automação e mais, tudo roda aqui.',
		},
		basePrice: { BRL: 1200, USD: 280 },
		maintenance: {
			price: { BRL: 150, USD: 35 },
		},
		estimatedSetupDays: 2,
		requires: ['domain-setup'],
		configurations: [
			{
				id: 'server-size',
				label: {
					en: 'Server Size',
					'pt-BR': 'Tamanho do Servidor',
				},
				type: 'single-select',
				required: true,
				defaultOptionId: 'small',
				options: [
					{
						id: 'small',
						label: {
							en: 'Small',
							'pt-BR': 'Pequeno',
						},
						description: {
							en: 'Up to 3 users, mostly static sites, under 5,000 monthly visitors.',
							'pt-BR': 'Até 3 usuários, principalmente sites estáticos, menos de 5.000 visitantes/mês.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						thirdPartyCosts: [COST_CLOUD_SMALL],
					},
					{
						id: 'medium',
						label: {
							en: 'Medium',
							'pt-BR': 'Médio',
						},
						description: {
							en: '3–10 users, CRM + email + moderate traffic, 5,000–50,000 monthly visitors.',
							'pt-BR': '3–10 usuários, CRM + email + tráfego moderado, 5.000–50.000 visitantes/mês.',
						},
						priceModifier: { BRL: 300, USD: 70 },
						thirdPartyCosts: [COST_CLOUD_MEDIUM],
					},
					{
						id: 'large',
						label: {
							en: 'Large',
							'pt-BR': 'Grande',
						},
						description: {
							en: '10+ users, high-traffic site or real-time backend, 50,000+ monthly visitors.',
							'pt-BR': '10+ usuários, site de alto tráfego ou backend em tempo real, 50.000+ visitantes/mês.',
						},
						priceModifier: { BRL: 600, USD: 140 },
						thirdPartyCosts: [COST_CLOUD_LARGE],
					},
				],
			},
		],
		clientDeliverables: [DELIVERABLE_CLOUD_PAYMENT, DELIVERABLE_CONFIRMED_DOMAIN],
		active: true,
	},

	// 1.2 Domain Setup
	{
		id: 'domain-setup',
		category: 'infrastructure',
		name: {
			en: 'Custom Domain Setup',
			'pt-BR': 'Configuração de Domínio Customizado',
		},
		shortDescription: {
			en: 'Get your custom domain (e.g., yourstudio.com) up and running, with secure connections and professional email-ready setup.',
			'pt-BR': 'Deixe seu domínio customizado (ex: seuestudio.com) funcionando, com conexões seguras e pronto para email profissional.',
		},
		longDescription: {
			en: 'We configure your custom domain with DNS management, SSL certificates, and subdomains for all your services. Your domain will be ready for email, hosting, and any other tools in your package.',
			'pt-BR': 'Configuramos seu domínio customizado com gerenciamento de DNS, certificados SSL e subdomínios para todos os seus serviços. Seu domínio estará pronto para email, hospedagem e quaisquer outras ferramentas do seu pacote.',
		},
		basePrice: { BRL: 300, USD: 70 },
		maintenance: null,
		estimatedSetupDays: 0.5,
		clientDeliverables: [DELIVERABLE_DOMAIN, DELIVERABLE_DOMAIN_REGISTRAR_ACCESS],
		thirdPartyCosts: [COST_DOMAIN_REGISTRATION],
		active: true,
	},

	// 1.3 Studio Control Panel
	{
		id: 'studio-control-panel',
		category: 'infrastructure',
		name: {
			en: 'Studio Control Panel',
			'pt-BR': 'Painel de Controle do Estúdio',
		},
		shortDescription: {
			en: 'A single beautiful page that gives you quick access to all your tools — analytics, CRM, scheduling, mailing list, and anything else in your package. One login, one place.',
			'pt-BR': 'Uma única página bonita com acesso rápido a todas as suas ferramentas — analytics, CRM, agendamento, lista de emails e tudo mais do seu pacote. Um login, um lugar só.',
		},
		longDescription: {
			en: 'A custom dashboard page on your domain that links to every tool in your stack. We match it to your branding and keep it updated as you add services. Simple, clean, and always one click away from everything.',
			'pt-BR': 'Uma página de dashboard customizada no seu domínio que linka para cada ferramenta do seu stack. Combinamos com sua marca e mantemos atualizada conforme você adiciona serviços. Simples, limpa, e sempre a um clique de tudo.',
		},
		basePrice: { BRL: 150, USD: 35 },
		maintenance: {
			price: { BRL: 30, USD: 8 },
		},
		estimatedSetupDays: 0.5,
		requires: ['cloud-server'],
		clientDeliverables: [DELIVERABLE_LOGO_BRANDING],
		active: true,
	},
];
