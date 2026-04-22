import type { ClientDeliverable } from './types';

// Shared deliverable definitions, reused across multiple services.
// Keyed by stable ID for deduplication in the builder.

export const DELIVERABLE_DOMAIN: ClientDeliverable = {
	id: 'domain-name',
	type: 'domain',
	label: {
		en: 'Purchased domain name',
		'pt-BR': 'Nome de domínio comprado',
	},
	description: {
		en: 'We can advise on registration if needed.',
		'pt-BR': 'Podemos ajudar com o registro se necessário.',
	},
};

export const DELIVERABLE_DOMAIN_REGISTRAR_ACCESS: ClientDeliverable = {
	id: 'domain-registrar-access',
	type: 'account-access',
	label: {
		en: 'Account access at the domain registrar',
		'pt-BR': 'Acesso à conta no registrador de domínio',
	},
};

export const DELIVERABLE_CLOUD_PAYMENT: ClientDeliverable = {
	id: 'cloud-payment-method',
	type: 'payment-method',
	label: {
		en: 'Payment method for the cloud provider',
		'pt-BR': 'Método de pagamento para o provedor de nuvem',
	},
	description: {
		en: "We'll recommend the best option for your tier.",
		'pt-BR': 'Recomendaremos a melhor opção para o seu plano.',
	},
};

export const DELIVERABLE_TEAM_MEMBERS: ClientDeliverable = {
	id: 'team-member-list',
	type: 'other',
	label: {
		en: 'List of initial team members',
		'pt-BR': 'Lista dos membros iniciais da equipe',
	},
};

export const DELIVERABLE_LOGO_BRANDING: ClientDeliverable = {
	id: 'logo-branding',
	type: 'other',
	label: {
		en: 'Your logo and brand colors (optional)',
		'pt-BR': 'Seu logo e cores da marca (opcional)',
	},
};

export const DELIVERABLE_REPO_ACCESS: ClientDeliverable = {
	id: 'repo-access',
	type: 'account-access',
	label: {
		en: 'Access to your code repository',
		'pt-BR': 'Acesso ao seu repositório de código',
	},
};

export const DELIVERABLE_LICENSE_CREDENTIALS: ClientDeliverable = {
	id: 'license-credentials',
	type: 'credentials',
	label: {
		en: 'Licensing credentials if needed for your build targets',
		'pt-BR': 'Credenciais de licença se necessárias para seus alvos de build',
	},
};

export const DELIVERABLE_CALENDAR_ACCESS: ClientDeliverable = {
	id: 'calendar-access',
	type: 'account-access',
	label: {
		en: 'Access to your existing calendar (Google, Outlook, or Apple)',
		'pt-BR': 'Acesso ao seu calendário existente (Google, Outlook ou Apple)',
	},
};

export const DELIVERABLE_MEETING_TYPES: ClientDeliverable = {
	id: 'meeting-types',
	type: 'decision',
	label: {
		en: 'The types of meetings you want to offer',
		'pt-BR': 'Os tipos de reunião que você quer oferecer',
	},
	description: {
		en: 'e.g., "30-min intro call," "60-min consultation"',
		'pt-BR': 'ex: "Chamada de 30min," "Consultoria de 60min"',
	},
};

export const DELIVERABLE_AVAILABILITY: ClientDeliverable = {
	id: 'weekly-availability',
	type: 'decision',
	label: {
		en: 'Your weekly availability',
		'pt-BR': 'Sua disponibilidade semanal',
	},
};

export const DELIVERABLE_SENDER_IDENTITY: ClientDeliverable = {
	id: 'sender-identity',
	type: 'decision',
	label: {
		en: 'Your desired sender identity (e.g., studio@yourdomain.com)',
		'pt-BR': 'A identidade de remetente desejada (ex: estudio@seudominio.com)',
	},
};

export const DELIVERABLE_SIGNUP_LOCATION: ClientDeliverable = {
	id: 'signup-location',
	type: 'decision',
	label: {
		en: 'Where the signup form should live',
		'pt-BR': 'Onde o formulário de inscrição deve ficar',
	},
	description: {
		en: 'Existing site, new landing page, or we can advise.',
		'pt-BR': 'Site existente, landing page nova, ou podemos recomendar.',
	},
};

export const DELIVERABLE_WEBSITES_TO_TRACK: ClientDeliverable = {
	id: 'websites-to-track',
	type: 'other',
	label: {
		en: 'List of websites or apps you want to track',
		'pt-BR': 'Lista de sites ou apps que você quer rastrear',
	},
};

export const DELIVERABLE_SERVICES_TO_MONITOR: ClientDeliverable = {
	id: 'services-to-monitor',
	type: 'other',
	label: {
		en: 'List of websites and services to monitor',
		'pt-BR': 'Lista de sites e serviços para monitorar',
	},
};

export const DELIVERABLE_ALERT_DESTINATIONS: ClientDeliverable = {
	id: 'alert-destinations',
	type: 'decision',
	label: {
		en: 'Where you want alerts delivered (Discord, email, phone, etc.)',
		'pt-BR': 'Onde você quer receber alertas (Discord, email, celular, etc.)',
	},
};

export const DELIVERABLE_INVOICE_BRANDING: ClientDeliverable = {
	id: 'invoice-branding',
	type: 'other',
	label: {
		en: 'Your company info for invoice branding (logo, address, tax ID) — optional',
		'pt-BR': 'Dados da empresa para notas (logo, endereço, CNPJ) — opcional',
	},
};

export const DELIVERABLE_STORAGE_SUBDOMAIN: ClientDeliverable = {
	id: 'storage-subdomain',
	type: 'decision',
	label: {
		en: 'Desired subdomain (e.g., files.yourdomain.com)',
		'pt-BR': 'Subdomínio desejado (ex: files.seudominio.com)',
	},
};

export const DELIVERABLE_STORAGE_NEEDS: ClientDeliverable = {
	id: 'storage-needs',
	type: 'other',
	label: {
		en: 'List of team members and their approximate storage needs',
		'pt-BR': 'Lista de membros da equipe e suas necessidades de armazenamento',
	},
};

export const DELIVERABLE_SOCIAL_ACCOUNTS: ClientDeliverable = {
	id: 'social-accounts',
	type: 'account-access',
	label: {
		en: 'List of social media accounts you want to connect',
		'pt-BR': 'Lista de contas de redes sociais que você quer conectar',
	},
};

export const DELIVERABLE_CRM_EXPORT: ClientDeliverable = {
	id: 'crm-export',
	type: 'other',
	label: {
		en: 'Export from existing CRM if migrating data (optional)',
		'pt-BR': 'Exportação do CRM existente se migrar dados (opcional)',
	},
};

export const DELIVERABLE_AUTOMATION_CREDENTIALS: ClientDeliverable = {
	id: 'automation-credentials',
	type: 'credentials',
	label: {
		en: 'Access credentials for the services your automations need to touch',
		'pt-BR': 'Credenciais de acesso para os serviços que suas automações precisam acessar',
	},
};

export const DELIVERABLE_STUDIO_BRANDING: ClientDeliverable = {
	id: 'studio-branding',
	type: 'other',
	label: {
		en: 'Studio branding (logo, colors, fonts — or we can help create them)',
		'pt-BR': 'Identidade visual do estúdio (logo, cores, fontes — ou podemos ajudar a criar)',
	},
};

export const DELIVERABLE_PROJECT_SHOWCASE: ClientDeliverable = {
	id: 'project-showcase',
	type: 'other',
	label: {
		en: 'List of projects to showcase, with screenshots or art',
		'pt-BR': 'Lista de projetos para exibir, com screenshots ou arte',
	},
};

export const DELIVERABLE_WEBSITE_COPY: ClientDeliverable = {
	id: 'website-copy',
	type: 'other',
	label: {
		en: "Copy for each section (or tell us what you want and we'll draft)",
		'pt-BR': 'Texto para cada seção (ou diga o que quer e a gente escreve)',
	},
};

export const DELIVERABLE_CONTACT_EMAIL: ClientDeliverable = {
	id: 'contact-email',
	type: 'decision',
	label: {
		en: 'Contact email for the form',
		'pt-BR': 'Email de contato para o formulário',
	},
};

export const DELIVERABLE_PRESS_STUDIO_INFO: ClientDeliverable = {
	id: 'press-studio-info',
	type: 'other',
	label: {
		en: 'Studio info (founding date, location, team)',
		'pt-BR': 'Info do estúdio (data de fundação, localização, equipe)',
	},
};

export const DELIVERABLE_PRESS_GAME_INFO: ClientDeliverable = {
	id: 'press-game-info',
	type: 'other',
	label: {
		en: 'Game/project info (release date, platforms, genre, description)',
		'pt-BR': 'Info do jogo/projeto (data de lançamento, plataformas, gênero, descrição)',
	},
};

export const DELIVERABLE_PRESS_ASSETS: ClientDeliverable = {
	id: 'press-assets',
	type: 'other',
	label: {
		en: 'High-res screenshots, key art, logos',
		'pt-BR': 'Screenshots em alta resolução, key art, logos',
	},
};

export const DELIVERABLE_PRESS_CONTACT: ClientDeliverable = {
	id: 'press-contact',
	type: 'decision',
	label: {
		en: 'Contact info for press',
		'pt-BR': 'Info de contato para a imprensa',
	},
};

export const DELIVERABLE_PLAYTEST_FORM_FIELDS: ClientDeliverable = {
	id: 'playtest-form-fields',
	type: 'decision',
	label: {
		en: 'Fields you want on the signup form',
		'pt-BR': 'Campos que você quer no formulário de inscrição',
	},
	description: {
		en: 'Email, platform, experience level, device specs, etc.',
		'pt-BR': 'Email, plataforma, nível de experiência, specs do dispositivo, etc.',
	},
};

export const DELIVERABLE_TRIAGE_CRITERIA: ClientDeliverable = {
	id: 'triage-criteria',
	type: 'decision',
	label: {
		en: 'Triage criteria (if any)',
		'pt-BR': 'Critérios de triagem (se houver)',
	},
	description: {
		en: 'e.g., "only Windows users with 16GB+ RAM"',
		'pt-BR': 'ex: "apenas usuários Windows com 16GB+ de RAM"',
	},
};

export const DELIVERABLE_ACCESS_DELIVERY_METHOD: ClientDeliverable = {
	id: 'access-delivery-method',
	type: 'decision',
	label: {
		en: 'Access delivery method (Steam key batch, download link, invite code, etc.)',
		'pt-BR': 'Método de entrega de acesso (batch de keys Steam, link de download, código de convite, etc.)',
	},
};

export const DELIVERABLE_WELCOME_EMAIL_CONTENT: ClientDeliverable = {
	id: 'welcome-email-content',
	type: 'other',
	label: {
		en: 'Content for the welcome/access email (or we can draft)',
		'pt-BR': 'Conteúdo do email de boas-vindas/acesso (ou podemos rascunhar)',
	},
};

export const DELIVERABLE_COMMUNITY_ADMIN_ACCESS: ClientDeliverable = {
	id: 'community-admin-access',
	type: 'account-access',
	label: {
		en: 'Admin access to your chosen platform (or consent to create the server)',
		'pt-BR': 'Acesso admin à plataforma escolhida (ou consentimento para criar o servidor)',
	},
};

export const DELIVERABLE_COMMUNITY_BRANDING: ClientDeliverable = {
	id: 'community-branding',
	type: 'other',
	label: {
		en: 'Your studio branding (logo, colors) for server icon and welcome messages',
		'pt-BR': 'Identidade visual do estúdio (logo, cores) para ícone do servidor e mensagens de boas-vindas',
	},
};

export const DELIVERABLE_ROLE_STRUCTURE: ClientDeliverable = {
	id: 'role-structure',
	type: 'decision',
	label: {
		en: 'Desired role structure (e.g., "Founders," "Mods," "Playtesters," "Fans")',
		'pt-BR': 'Estrutura de cargos desejada (ex: "Fundadores," "Mods," "Playtesters," "Fãs")',
	},
};

export const DELIVERABLE_CONTENT_PROCESS: ClientDeliverable = {
	id: 'content-process',
	type: 'other',
	label: {
		en: 'Current content process documented, even informally',
		'pt-BR': 'Processo de conteúdo atual documentado, mesmo informalmente',
	},
};

export const DELIVERABLE_CONTENT_PLATFORMS: ClientDeliverable = {
	id: 'content-platforms',
	type: 'other',
	label: {
		en: 'List of platforms involved',
		'pt-BR': 'Lista de plataformas envolvidas',
	},
};

export const DELIVERABLE_APPROVAL_CHAIN: ClientDeliverable = {
	id: 'approval-chain',
	type: 'decision',
	label: {
		en: 'Approval chain (who reviews what, if applicable)',
		'pt-BR': 'Cadeia de aprovação (quem revisa o quê, se aplicável)',
	},
};
