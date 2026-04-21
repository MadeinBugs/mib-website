import type { ServiceItem } from '../types';
import {
	DELIVERABLE_SENDER_IDENTITY,
	DELIVERABLE_SIGNUP_LOCATION,
} from '../deliverables';
import { COST_MAILING_LIST } from '../third-party-costs';

export const marketingServices: ServiceItem[] = [
	// 5.1 Mailing List
	{
		id: 'mailing-list',
		category: 'marketing',
		name: {
			en: 'Mailing List',
			'pt-BR': 'Lista de Emails',
		},
		shortDescription: {
			en: 'Newsletter signup, confirmation flow, unsubscribe handling, and international compliance. Ready to grow your audience.',
			'pt-BR': 'Cadastro de newsletter, fluxo de confirmação, cancelamento e conformidade internacional. Pronto para crescer sua audiência.',
		},
		longDescription: {
			en: 'Full newsletter infrastructure: signup form, double opt-in confirmation, unsubscribe handling, bounce management, and compliance with LGPD/GDPR. We set up the pipeline end-to-end so you can focus on writing great content.',
			'pt-BR': 'Infraestrutura completa de newsletter: formulário de cadastro, confirmação double opt-in, cancelamento, gerenciamento de bounces e conformidade com LGPD/GDPR. Montamos o pipeline de ponta a ponta para você focar em escrever conteúdo incrível.',
		},
		basePrice: { BRL: 900, USD: 210 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 1.5,
		recommends: ['transactional-email'],
		clientDeliverables: [DELIVERABLE_SENDER_IDENTITY, DELIVERABLE_SIGNUP_LOCATION],
		thirdPartyCosts: [COST_MAILING_LIST],
		active: true,
	},

	// 5.2 Transactional Emails
	{
		id: 'transactional-email',
		category: 'marketing',
		name: {
			en: 'Transactional Emails',
			'pt-BR': 'Emails Transacionais',
		},
		shortDescription: {
			en: 'Automatic emails for signup confirmations, password resets, order receipts, and any other event-triggered messages. Base price covers pipeline setup with a single simple template.',
			'pt-BR': 'Emails automáticos para confirmação de cadastro, redefinição de senha, recibos de pedido e outras mensagens acionadas por eventos. Preço base cobre setup do pipeline com um template simples.',
		},
		longDescription: {
			en: 'Automatic emails for signup confirmations, password resets, order receipts, and any other event-triggered messages. Base price covers pipeline setup with a single simple template. Each additional template is described and quoted after review.',
			'pt-BR': 'Emails automáticos para confirmação de cadastro, redefinição de senha, recibos de pedido e outras mensagens acionadas por eventos. Preço base cobre setup do pipeline com um template simples. Cada template adicional é descrito e orçado após análise.',
		},
		basePrice: { BRL: 700, USD: 165 },
		maintenance: {
			price: { BRL: 80, USD: 20 },
		},
		estimatedSetupDays: 1,
		customFields: [
			{
				id: 'email-templates-needed',
				label: {
					en: 'Describe each email template you want built',
					'pt-BR': 'Descreva cada template de email que você quer',
				},
				placeholder: {
					en: 'e.g., "Welcome email after signup, bilingual EN/PT-BR, with button linking to our Discord" — each template typically ranges R$ 80 (simple plain-text in one locale) to R$ 300 (branded HTML with images, bilingual)',
					'pt-BR': 'ex: "Email de boas-vindas após cadastro, bilíngue EN/PT-BR, com botão linkando pro Discord" — cada template tipicamente varia de R$ 80 (texto simples em um idioma) a R$ 300 (HTML com marca, imagens, bilíngue)',
				},
				type: 'textarea',
				repeatable: true,
				pendingPricing: true,
				maxItems: 15,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [DELIVERABLE_SENDER_IDENTITY],
		active: true,
	},
];
