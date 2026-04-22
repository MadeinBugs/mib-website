import type { ServiceItem } from '../types';
import {
	DELIVERABLE_WEBSITES_TO_TRACK,
	DELIVERABLE_SERVICES_TO_MONITOR,
	DELIVERABLE_ALERT_DESTINATIONS,
} from '../deliverables';

export const analyticsServices: ServiceItem[] = [
	// 6.1 Website Analytics
	{
		id: 'web-analytics',
		category: 'analytics',
		name: {
			en: 'Website Analytics',
			'pt-BR': 'Analytics de Site',
		},
		shortDescription: {
			en: 'Know who visits your site, where they come from, and what they do. Privacy-friendly and cookieless — no annoying consent banner needed.',
			'pt-BR': 'Saiba quem visita seu site, de onde vêm e o que fazem. Amigável à privacidade e sem cookies — sem banner de consentimento chato.',
		},
		longDescription: {
			en: 'Self-hosted analytics (Umami) that respects visitor privacy. No cookies, no consent banners, fully GDPR/LGPD compliant. Track page views, referrers, devices, custom events, and conversion funnels — all on your own server with your own data.',
			'pt-BR': 'Analytics self-hosted (Umami) que respeita a privacidade dos visitantes. Sem cookies, sem banners de consentimento, totalmente compatível com GDPR/LGPD. Acompanhe visualizações, referências, dispositivos, eventos customizados e funis de conversão — tudo no seu próprio servidor com seus próprios dados.',
		},
		basePrice: { BRL: 600, USD: 140 },
		maintenance: {
			price: { BRL: 70, USD: 16 },
		},
		estimatedSetupDays: 1,
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
							en: 'Self-hosted (Umami)',
							'pt-BR': 'Auto-hospedado (Umami)',
						},
						description: {
							en: 'Full control on your own server. No data sharing.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem compartilhamento de dados.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'plausible',
						label: {
							en: 'Plausible Analytics',
							'pt-BR': 'Plausible Analytics',
						},
						description: {
							en: 'Platform costs not included. Privacy-friendly.',
							'pt-BR': 'Custos de plataforma não inclusos. Amigável à privacidade.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'google-analytics',
						label: {
							en: 'Google Analytics',
							'pt-BR': 'Google Analytics',
						},
						description: {
							en: 'Free. Requires cookie consent banner.',
							'pt-BR': 'Gratuito. Requer banner de consentimento de cookies.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
				],
			},
		],
		clientDeliverables: [DELIVERABLE_WEBSITES_TO_TRACK],
		active: true,
	},

	// 6.2 Branded Short Links
	{
		id: 'url-shortener',
		category: 'analytics',
		name: {
			en: 'Branded Short Links',
			'pt-BR': 'Links Curtos com Sua Marca',
		},
		shortDescription: {
			en: 'Short links with your own domain (e.g., go.yourstudio.com/xyz) and click tracking. Great for social media, email campaigns, and print material.',
			'pt-BR': 'Links curtos com seu próprio domínio (ex: go.seuestudio.com/xyz) e rastreamento de cliques. Ótimo para redes sociais, campanhas de email e material impresso.',
		},
		longDescription: {
			en: 'Self-hosted link shortener (Shlink) on your own domain. Create branded short links, track clicks by source and device, and manage campaigns. Perfect for social media bios, email CTAs, and print QR codes.',
			'pt-BR': 'Encurtador de links self-hosted (Shlink) no seu próprio domínio. Crie links curtos com sua marca, rastreie cliques por fonte e dispositivo e gerencie campanhas. Perfeito para bios em redes sociais, CTAs de email e QR codes impressos.',
		},
		basePrice: { BRL: 500, USD: 115 },
		maintenance: {
			price: { BRL: 60, USD: 14 },
		},
		estimatedSetupDays: 1,
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
							en: 'Self-hosted (Shlink)',
							'pt-BR': 'Auto-hospedado (Shlink)',
						},
						description: {
							en: 'Full control on your own server. Requires a custom domain.',
							'pt-BR': 'Controle total no seu próprio servidor. Requer domínio customizado.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server', 'domain-setup'],
					},
					{
						id: 'bitly',
						label: {
							en: 'Bitly',
							'pt-BR': 'Bitly',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'short-io',
						label: {
							en: 'Short.io',
							'pt-BR': 'Short.io',
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
		clientDeliverables: [],
		active: true,
	},

	// 6.3 Uptime Monitoring
	{
		id: 'uptime-monitoring',
		category: 'analytics',
		name: {
			en: 'Uptime Monitoring',
			'pt-BR': 'Monitoramento de Disponibilidade',
		},
		shortDescription: {
			en: 'Know instantly when your site or services go down. Alerts delivered wherever you want — Discord, email, or phone.',
			'pt-BR': 'Saiba na hora quando seu site ou serviços saem do ar. Alertas entregues onde você quiser — Discord, email ou celular.',
		},
		longDescription: {
			en: 'Self-hosted uptime monitoring (Uptime Kuma) with custom alert routing. Monitor any URL, port, or service. Get notified via Discord, email, SMS, or push notification the moment something goes down — and again when it comes back up.',
			'pt-BR': 'Monitoramento de disponibilidade self-hosted (Uptime Kuma) com roteamento de alertas customizado. Monitore qualquer URL, porta ou serviço. Seja notificado via Discord, email, SMS ou notificação push no momento em que algo cai — e de novo quando volta.',
		},
		basePrice: { BRL: 400, USD: 95 },
		maintenance: {
			price: { BRL: 50, USD: 12 },
		},
		estimatedSetupDays: 0.5,
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
							en: 'Self-hosted (Uptime Kuma)',
							'pt-BR': 'Auto-hospedado (Uptime Kuma)',
						},
						description: {
							en: 'Full control on your own server.',
							'pt-BR': 'Controle total no seu próprio servidor.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'uptimerobot',
						label: {
							en: 'UptimeRobot',
							'pt-BR': 'UptimeRobot',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'better-uptime',
						label: {
							en: 'Better Uptime',
							'pt-BR': 'Better Uptime',
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
		clientDeliverables: [DELIVERABLE_SERVICES_TO_MONITOR, DELIVERABLE_ALERT_DESTINATIONS],
		active: true,
	},
];
