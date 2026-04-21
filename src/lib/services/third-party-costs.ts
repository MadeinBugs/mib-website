import type { ThirdPartyCost } from './types';

// Shared third-party cost definitions, reused across services.
// Keyed by stable ID for deduplication in the builder.

export const COST_CLOUD_SMALL: ThirdPartyCost = {
	id: 'cloud-hosting-small',
	label: {
		en: 'Cloud server hosting (Small tier)',
		'pt-BR': 'Hospedagem de servidor na nuvem (Plano Pequeno)',
	},
	amount: { BRL: 0, USD: 0 },
	amountMax: { BRL: 40, USD: 10 },
	frequency: 'monthly',
	note: {
		en: 'Depends on usage. Free-tier eligible for low traffic.',
		'pt-BR': 'Depende do uso. Elegível ao tier gratuito para tráfego baixo.',
	},
};

export const COST_CLOUD_MEDIUM: ThirdPartyCost = {
	id: 'cloud-hosting-medium',
	label: {
		en: 'Cloud server hosting (Medium tier)',
		'pt-BR': 'Hospedagem de servidor na nuvem (Plano Médio)',
	},
	amount: { BRL: 60, USD: 15 },
	amountMax: { BRL: 150, USD: 35 },
	frequency: 'monthly',
	note: {
		en: 'Depends on usage and traffic.',
		'pt-BR': 'Depende do uso e tráfego.',
	},
};

export const COST_CLOUD_LARGE: ThirdPartyCost = {
	id: 'cloud-hosting-large',
	label: {
		en: 'Cloud server hosting (Large tier)',
		'pt-BR': 'Hospedagem de servidor na nuvem (Plano Grande)',
	},
	amount: { BRL: 150, USD: 35 },
	amountMax: { BRL: 400, USD: 95 },
	frequency: 'monthly',
	note: {
		en: 'High-traffic or resource-intensive workloads.',
		'pt-BR': 'Cargas de trabalho com alto tráfego ou uso intensivo de recursos.',
	},
};

export const COST_DOMAIN_REGISTRATION: ThirdPartyCost = {
	id: 'domain-registration',
	label: {
		en: 'Domain registration',
		'pt-BR': 'Registro de domínio',
	},
	amount: { BRL: 40, USD: 10 },
	amountMax: { BRL: 100, USD: 25 },
	frequency: 'yearly',
	note: {
		en: 'Paid directly to the registrar. Price varies by TLD.',
		'pt-BR': 'Pago diretamente ao registrador. Preço varia conforme o TLD.',
	},
};

export const COST_MAILING_LIST: ThirdPartyCost = {
	id: 'mailing-list-service',
	label: {
		en: 'Email service (mailing list)',
		'pt-BR': 'Serviço de email (lista de emails)',
	},
	amount: { BRL: 0, USD: 0 },
	amountMax: { BRL: 130, USD: 30 },
	frequency: 'monthly',
	note: {
		en: 'Free for small lists; scales with audience size.',
		'pt-BR': 'Gratuito para listas pequenas; escala com o tamanho da audiência.',
	},
};

export const COST_BACKUP_STORAGE: ThirdPartyCost = {
	id: 'backup-storage',
	label: {
		en: 'External backup storage',
		'pt-BR': 'Armazenamento externo de backup',
	},
	amount: { BRL: 15, USD: 4 },
	amountMax: { BRL: 50, USD: 12 },
	frequency: 'monthly',
	note: {
		en: 'Depends on data volume. Paid directly to the storage provider.',
		'pt-BR': 'Depende do volume de dados. Pago diretamente ao provedor de armazenamento.',
	},
};

export const COST_CLOUD_STORAGE_EXTRA: ThirdPartyCost = {
	id: 'cloud-storage-extra',
	label: {
		en: 'External storage for team cloud',
		'pt-BR': 'Armazenamento externo para nuvem da equipe',
	},
	amount: { BRL: 30, USD: 7 },
	amountMax: { BRL: 50, USD: 12 },
	frequency: 'monthly',
	note: {
		en: 'Optional — small teams often fit on the server itself.',
		'pt-BR': 'Opcional — equipes pequenas geralmente cabem no servidor.',
	},
};
