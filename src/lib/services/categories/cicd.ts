import type { ServiceItem } from '../types';
import {
	DELIVERABLE_REPO_ACCESS,
	DELIVERABLE_LICENSE_CREDENTIALS,
	DELIVERABLE_TEAM_MEMBERS,
} from '../deliverables';

export const cicdServices: ServiceItem[] = [
	// 2.1 CI/CD Build Pipeline
	{
		id: 'cicd-pipeline',
		category: 'cicd',
		name: {
			en: 'CI/CD Build Pipeline',
			'pt-BR': 'Pipeline de Build CI/CD',
		},
		shortDescription: {
			en: 'Automated builds triggered on every commit, with optional deploy to production. Base price covers setup for a single simple target.',
			'pt-BR': 'Builds automáticos a cada commit, com deploy opcional para produção. Preço base cobre setup para um alvo simples.',
		},
		longDescription: {
			en: 'Automated builds triggered on every commit, with optional deploy to production. Base price covers setup for a single simple target (one platform, no code signing, straightforward deploy). Complex cases — multi-platform game builds, code signing, custom deployment pipelines — are quoted after review.',
			'pt-BR': 'Builds automáticos a cada commit, com deploy opcional para produção. Preço base cobre setup para um alvo simples (uma plataforma, sem assinatura de código, deploy direto). Casos complexos — builds de jogos multi-plataforma, assinatura de código, pipelines de deploy customizados — são orçados após análise.',
		},
		basePrice: { BRL: 800, USD: 185 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 4,
		customFields: [
			{
				id: 'build-requirements',
				label: {
					en: 'Describe what you need built and deployed',
					'pt-BR': 'Descreva o que você precisa buildar e deployar',
				},
				placeholder: {
					en: 'e.g., "Unity game, need Windows + Mac builds after every push to main, auto-upload to itch.io" — typical full setups range R$ 800 (simple) to R$ 3,000 (multi-platform game with signing)',
					'pt-BR': 'ex: "Jogo Unity, preciso de builds Windows + Mac após cada push na main, auto-upload para itch.io" — setups típicos variam de R$ 800 (simples) a R$ 3.000 (jogo multi-plataforma com assinatura)',
				},
				type: 'textarea',
				repeatable: false,
				pendingPricing: true,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [DELIVERABLE_REPO_ACCESS, DELIVERABLE_LICENSE_CREDENTIALS],
		active: true,
	},

	// 2.2 Private Repository & Version Control
	{
		id: 'versioning-repo',
		category: 'cicd',
		name: {
			en: 'Private Repository & Version Control',
			'pt-BR': 'Repositório Privado e Controle de Versão',
		},
		shortDescription: {
			en: 'Private repository and versioning tools to host your team\'s code and assets. Base price covers setup for a standard team without migration.',
			'pt-BR': 'Ferramentas de repositório privado e versionamento para hospedar o código e assets da sua equipe. Preço base cobre setup para uma equipe padrão sem migração.',
		},
		longDescription: {
			en: 'Private repository and versioning tools to host your team\'s code and assets. Base price covers setup for a standard team without migration. Larger teams and migrations from existing platforms (GitHub, GitLab, Bitbucket) are quoted after review.',
			'pt-BR': 'Ferramentas de repositório privado e versionamento para hospedar o código e assets da sua equipe. Preço base cobre setup para uma equipe padrão sem migração. Equipes maiores e migrações de plataformas existentes (GitHub, GitLab, Bitbucket) são orçadas após análise.',
		},
		basePrice: { BRL: 700, USD: 165 },
		maintenance: {
			price: { BRL: 100, USD: 23 },
		},
		estimatedSetupDays: 3,
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
							en: 'Self-hosted (Gitea)',
							'pt-BR': 'Auto-hospedado (Gitea)',
						},
						description: {
							en: 'Full control on your own server. No per-seat fees.',
							'pt-BR': 'Controle total no seu próprio servidor. Sem cobrança por assento.',
						},
						priceModifier: { BRL: 0, USD: 0 },
						additionalRequires: ['cloud-server'],
					},
					{
						id: 'github',
						label: {
							en: 'GitHub',
							'pt-BR': 'GitHub',
						},
						description: {
							en: 'Platform costs not included. Free for public repos; paid plans for private.',
							'pt-BR': 'Custos de plataforma não inclusos. Gratuito para repos públicos; planos pagos para privados.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'gitlab',
						label: {
							en: 'GitLab',
							'pt-BR': 'GitLab',
						},
						description: {
							en: 'Platform costs not included.',
							'pt-BR': 'Custos de plataforma não inclusos.',
						},
						priceModifier: { BRL: 0, USD: 0 },
					},
					{
						id: 'bitbucket',
						label: {
							en: 'Bitbucket',
							'pt-BR': 'Bitbucket',
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
		customFields: [
			{
				id: 'versioning-needs',
				label: {
					en: "Describe your team's needs",
					'pt-BR': 'Descreva as necessidades da sua equipe',
				},
				placeholder: {
					en: 'e.g., "Team of 5 devs, migrating from GitHub, need Unity asset versioning with file locking" — migrations typically add R$ 300–800 depending on repo count and size',
					'pt-BR': 'ex: "Equipe de 5 devs, migrando do GitHub, preciso de versionamento de assets Unity com file locking" — migrações tipicamente adicionam R$ 300–800 dependendo da quantidade e tamanho dos repos',
				},
				type: 'textarea',
				repeatable: false,
				pendingPricing: true,
				minLength: 10,
				maxLength: 5000,
			},
		],
		clientDeliverables: [DELIVERABLE_TEAM_MEMBERS],
		active: true,
	},
];
