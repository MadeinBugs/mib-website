import type { ServiceItem } from '../types';
import {
	DELIVERABLE_TEAM_MEMBERS,
	DELIVERABLE_INVOICE_BRANDING,
	DELIVERABLE_STORAGE_NEEDS,
	DELIVERABLE_STORAGE_SUBDOMAIN,
} from '../deliverables';
import { COST_CLOUD_STORAGE_EXTRA } from '../third-party-costs';

export const internalToolsServices: ServiceItem[] = [
	// 7.1 Time Tracking
	{
		id: 'time-logging',
		category: 'internal-tools',
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

	// 7.2 Team Cloud Storage
	{
		id: 'cloud-storage',
		category: 'internal-tools',
		name: {
			en: 'Team Cloud Storage',
			'pt-BR': 'Armazenamento em Nuvem para Equipe',
		},
		shortDescription: {
			en: 'Your own private cloud storage — like Google Drive or Dropbox, but on your own domain with full data ownership. Sync, share, and collaborate.',
			'pt-BR': 'Seu próprio armazenamento em nuvem privado — como Google Drive ou Dropbox, mas no seu próprio domínio com propriedade total dos dados. Sincronize, compartilhe e colabore.',
		},
		longDescription: {
			en: 'Self-hosted cloud storage (Nextcloud) on your own domain. File sync across devices, collaborative editing, file sharing with expiring links, and mobile apps. Full data ownership — your files never leave your server unless you want them to.',
			'pt-BR': 'Armazenamento em nuvem self-hosted (Nextcloud) no seu próprio domínio. Sincronização de arquivos entre dispositivos, edição colaborativa, compartilhamento com links temporários e apps mobile. Propriedade total dos dados — seus arquivos nunca saem do seu servidor a menos que você queira.',
		},
		basePrice: { BRL: 1200, USD: 280 },
		maintenance: {
			price: { BRL: 150, USD: 35 },
		},
		estimatedSetupDays: 2,
		requires: ['cloud-server'],
		clientDeliverables: [DELIVERABLE_STORAGE_NEEDS, DELIVERABLE_STORAGE_SUBDOMAIN],
		thirdPartyCosts: [COST_CLOUD_STORAGE_EXTRA],
		active: true,
	},

	// 7.3 Team Password Manager
	{
		id: 'secrets-management',
		category: 'internal-tools',
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
		requires: ['cloud-server'],
		clientDeliverables: [DELIVERABLE_TEAM_MEMBERS],
		active: true,
	},
];
