import type { ServiceItem } from '../types';
import {
	DELIVERABLE_TEAM_MEMBERS,
	DELIVERABLE_INVOICE_BRANDING,
} from '../deliverables';

export const teamManagementServices: ServiceItem[] = [
	// 7.1 Time Tracking
	{
		id: 'time-logging',
		category: 'team-management',
		name: {
			en: 'Time Tracking',
			'pt-BR': 'Rastreamento de Horas',
		},
		shortDescription: {
			en: 'Log hours by project, client, and task. Generate reports and invoices. Essential for freelance and team billing.',
			'pt-BR': 'Registre horas por projeto, cliente e tarefa. Gere relatórios e notas. Essencial para cobrança de freelancers e equipes.',
		},
		longDescription: {
			en: 'Self-hosted time tracking with project and client organization, reporting, and invoice generation. Track billable and non-billable hours, export timesheets, and keep your team accountable — all on your own server.',
			'pt-BR': 'Rastreamento de horas self-hosted com organização por projeto e cliente, relatórios e geração de notas. Acompanhe horas faturáveis e não-faturáveis, exporte planilhas e mantenha sua equipe organizada — tudo no seu próprio servidor.',
		},
		basePrice: { BRL: 500, USD: 115 },
		maintenance: {
			price: { BRL: 60, USD: 14 },
		},
		estimatedSetupDays: 1,
		requires: ['cloud-server'],
		clientDeliverables: [DELIVERABLE_TEAM_MEMBERS, DELIVERABLE_INVOICE_BRANDING],
		active: true,
	},

	// 7.2 Team Password Manager
	{
		id: 'secrets-management',
		category: 'team-management',
		name: {
			en: 'Team Password Manager',
			'pt-BR': 'Gerenciador de Senhas da Equipe',
		},
		shortDescription: {
			en: "Securely store and share team credentials. Your own private vault — no one else can see your passwords.",
			'pt-BR': 'Armazene e compartilhe credenciais da equipe com segurança. Seu próprio cofre privado — ninguém mais vê suas senhas.',
		},
		longDescription: {
			en: 'Self-hosted password manager (Vaultwarden) for your team. Store passwords, API keys, secure notes, and credit cards in an encrypted vault. Share credentials safely between team members with granular access control. Browser extensions and mobile apps included.',
			'pt-BR': 'Gerenciador de senhas self-hosted (Vaultwarden) para sua equipe. Armazene senhas, chaves de API, notas seguras e cartões em um cofre criptografado. Compartilhe credenciais com segurança entre membros da equipe com controle de acesso granular. Extensões de navegador e apps mobile inclusos.',
		},
		basePrice: { BRL: 500, USD: 115 },
		maintenance: {
			price: { BRL: 60, USD: 14 },
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
							en: 'Self-hosted (Vaultwarden)',
							'pt-BR': 'Auto-hospedado (Vaultwarden)',
						},
						description: {
							en: 'Full control on your own server. No per-seat fees.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem cobrança por assento.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: '1password',
						label: {
							en: '1Password',
							'pt-BR': '1Password',
						},
						description: {
							en: 'Platform costs not included.',
							'pt-BR': 'Custos de plataforma não inclusos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'bitwarden-cloud',
						label: {
							en: 'Bitwarden Cloud',
							'pt-BR': 'Bitwarden Cloud',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'dashlane',
						label: {
							en: 'Dashlane',
							'pt-BR': 'Dashlane',
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
		clientDeliverables: [DELIVERABLE_TEAM_MEMBERS],
		active: true,
	},
];
