import type { ServiceItem } from '../types';
import {
	DELIVERABLE_AUTOMATION_CREDENTIALS,
} from '../deliverables';
import { COST_BACKUP_STORAGE } from '../third-party-costs';

export const automationServices: ServiceItem[] = [
	// 3.1 Workflow Automation
	{
		id: 'automation-platform',
		category: 'automation',
		name: {
			en: 'Workflow Automation',
			'pt-BR': 'Automação de Fluxos',
		},
		shortDescription: {
			en: 'Connect your tools and automate repetitive tasks. Send a Discord message when a new client signs up. Cross-post across social media. Sync data between systems.',
			'pt-BR': 'Conecte suas ferramentas e automatize tarefas repetitivas. Envie uma mensagem no Discord quando um novo cliente se cadastra. Faça cross-post entre redes sociais. Sincronize dados entre sistemas.',
		},
		longDescription: {
			en: 'A self-hosted automation platform (n8n) connected to your stack. Base price covers platform setup — each individual automation is described and quoted separately via the field below. Common automations: Discord notifications on new leads, cross-posting social media, syncing CRM with mailing list, automated follow-up emails.',
			'pt-BR': 'Uma plataforma de automação self-hosted (n8n) conectada ao seu stack. Preço base cobre setup da plataforma — cada automação individual é descrita e orçada separadamente pelo campo abaixo. Automações comuns: notificações no Discord para novos leads, cross-posting em redes sociais, sincronizar CRM com lista de emails, emails de follow-up automáticos.',
		},
		basePrice: { BRL: 800, USD: 185 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 1,
		requires: ['cloud-server'],
		customFields: [
			{
				id: 'custom-automations',
				label: {
					en: 'Describe each automation you want us to build',
					'pt-BR': 'Descreva cada automação que você quer que a gente construa',
				},
				placeholder: {
					en: 'e.g., "When a new signup hits our mailing list, post to #signups Discord channel and create a row in CRM" — each automation typically ranges R$ 100 (simple trigger → action) to R$ 500 (multi-step with conditions and external APIs)',
					'pt-BR': 'ex: "Quando um novo signup chega na lista de emails, postar no canal #signups do Discord e criar uma linha no CRM" — cada automação tipicamente varia de R$ 100 (trigger simples → ação) a R$ 500 (multi-step com condições e APIs externas)',
				},
				type: 'textarea',
				repeatable: true,
				pendingPricing: true,
				maxItems: 10,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [DELIVERABLE_AUTOMATION_CREDENTIALS],
		active: true,
	},

	// 3.2 Automated Backups
	{
		id: 'automated-backups',
		category: 'automation',
		name: {
			en: 'Automated Backup System',
			'pt-BR': 'Sistema de Backups Automáticos',
		},
		shortDescription: {
			en: 'Daily encrypted backups of your important data to secure external storage. Base price covers a single service with modest data volume.',
			'pt-BR': 'Backups diários criptografados dos seus dados importantes para armazenamento externo seguro. Preço base cobre um único serviço com volume modesto.',
		},
		longDescription: {
			en: 'Daily encrypted backups of your important data to secure external storage. Base price covers a single service with modest data volume. Larger data sets and multi-service backup scopes are quoted after review.',
			'pt-BR': 'Backups diários criptografados dos seus dados importantes para armazenamento externo seguro. Preço base cobre um único serviço com volume modesto. Volumes maiores e escopos multi-serviço são orçados após análise.',
		},
		basePrice: { BRL: 500, USD: 115 },
		maintenance: {
			price: { BRL: 60, USD: 14 },
		},
		estimatedSetupDays: 2,
		requires: ['cloud-server'],
		customFields: [
			{
				id: 'backup-scope',
				label: {
					en: 'Describe what needs to be backed up',
					'pt-BR': 'Descreva o que precisa de backup',
				},
				placeholder: {
					en: 'e.g., "Our CRM database (~500MB) plus the uploads folder (~20GB), keep last 30 days" — multi-service or high-volume (>50GB) setups typically add R$ 200–500',
					'pt-BR': 'ex: "Nosso banco do CRM (~500MB) mais a pasta de uploads (~20GB), manter últimos 30 dias" — setups multi-serviço ou alto volume (>50GB) tipicamente adicionam R$ 200–500',
				},
				type: 'textarea',
				repeatable: false,
				pendingPricing: true,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [],
		thirdPartyCosts: [COST_BACKUP_STORAGE],
		active: true,
	},
];
