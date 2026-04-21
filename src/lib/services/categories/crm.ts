import type { ServiceItem } from '../types';
import {
	DELIVERABLE_TEAM_MEMBERS,
	DELIVERABLE_CRM_EXPORT,
	DELIVERABLE_CALENDAR_ACCESS,
	DELIVERABLE_MEETING_TYPES,
	DELIVERABLE_AVAILABILITY,
} from '../deliverables';

export const crmServices: ServiceItem[] = [
	// 4.1 Customer Relationship Management
	{
		id: 'crm-setup',
		category: 'crm',
		name: {
			en: 'Customer Relationship Management (CRM)',
			'pt-BR': 'Gestão de Relacionamento com Cliente (CRM)',
		},
		shortDescription: {
			en: 'Track companies, contacts, deals, and follow-ups in one place. Never lose a lead or forget a client again. Full data ownership.',
			'pt-BR': 'Acompanhe empresas, contatos, negócios e follow-ups em um só lugar. Nunca mais perca um lead ou esqueça um cliente. Propriedade total dos dados.',
		},
		longDescription: {
			en: 'A self-hosted CRM (Twenty) with full data ownership. Track companies, people, deals, and tasks. Pipeline views, email integration, and API access for automation. Your data stays on your server — no per-seat fees, no vendor lock-in.',
			'pt-BR': 'Um CRM self-hosted (Twenty) com propriedade total dos dados. Acompanhe empresas, pessoas, negócios e tarefas. Visualizações de pipeline, integração de email e acesso via API para automação. Seus dados ficam no seu servidor — sem taxas por assento, sem vendor lock-in.',
		},
		basePrice: { BRL: 1000, USD: 230 },
		maintenance: {
			price: { BRL: 120, USD: 28 },
		},
		estimatedSetupDays: 2,
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
							en: 'Self-hosted (Twenty CRM)',
							'pt-BR': 'Auto-hospedado (Twenty CRM)',
						},
						description: {
							en: 'Full control on your own server. No per-seat fees.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem cobrança por assento.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'hubspot',
						label: {
							en: 'HubSpot',
							'pt-BR': 'HubSpot',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'pipedrive',
						label: {
							en: 'Pipedrive',
							'pt-BR': 'Pipedrive',
						},
						description: {
							en: 'Platform costs not included.',
							'pt-BR': 'Custos de plataforma não inclusos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'salesforce',
						label: {
							en: 'Salesforce',
							'pt-BR': 'Salesforce',
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
		clientDeliverables: [DELIVERABLE_TEAM_MEMBERS, DELIVERABLE_CRM_EXPORT],
		active: true,
	},

	// 4.2 Scheduling & Calendar
	{
		id: 'appointment-scheduling',
		category: 'crm',
		name: {
			en: 'Scheduling & Calendar',
			'pt-BR': 'Agendamento e Calendário',
		},
		shortDescription: {
			en: 'Public booking page with calendar integration. Clients self-book meetings with you.',
			'pt-BR': 'Página pública de agendamento com integração de calendário. Clientes marcam reuniões com você.',
		},
		longDescription: {
			en: 'A public booking page (Cal.com) where clients and partners can self-schedule meetings with you. Integrates with Google Calendar, Outlook, or Apple Calendar. Set your availability, define meeting types, and let the tool handle the rest.',
			'pt-BR': 'Uma página pública de agendamento (Cal.com) onde clientes e parceiros podem agendar reuniões com você. Integra com Google Calendar, Outlook ou Apple Calendar. Defina sua disponibilidade, tipos de reunião e deixe a ferramenta cuidar do resto.',
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
							en: 'Self-hosted (Cal.com)',
							'pt-BR': 'Auto-hospedado (Cal.com)',
						},
						description: {
							en: 'Full control on your own server. No per-seat fees.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem cobrança por assento.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'calendly',
						label: {
							en: 'Calendly',
							'pt-BR': 'Calendly',
						},
						description: {
							en: 'Platform costs not included. Free tier available.',
							'pt-BR': 'Custos de plataforma não inclusos. Plano gratuito disponível.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'savvycal',
						label: {
							en: 'SavvyCal',
							'pt-BR': 'SavvyCal',
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
		clientDeliverables: [DELIVERABLE_CALENDAR_ACCESS, DELIVERABLE_MEETING_TYPES, DELIVERABLE_AVAILABILITY],
		active: true,
	},
];
