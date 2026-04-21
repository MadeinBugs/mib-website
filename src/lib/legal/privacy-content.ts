import React from 'react';
import { FaServer, FaMobileAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import type { LegalIndexContent, LegalPageContent } from './types';

// ---------------------------------------------------------------------------
// Privacy index
// ---------------------------------------------------------------------------

export const privacyIndex: LegalIndexContent = {
	en: {
		title: 'Privacy Policy',
		subtitle: 'Select the privacy policy applicable to the product or service you are using.',
	},
	'pt-BR': {
		title: 'Política de Privacidade',
		subtitle: 'Selecione a política de privacidade aplicável ao produto ou serviço que você está utilizando.',
	},
	items: [
		{
			slug: 'services',
			icon: React.createElement(FaServer, { className: 'text-2xl' }),
			en: {
				title: 'B2B Infrastructure Services',
				description: 'How we handle data collected through the Infra Builder and B2B service engagements.',
			},
			'pt-BR': {
				title: 'Serviços de Infraestrutura B2B',
				description: 'Como tratamos dados coletados pelo Infra Builder e prestação de serviços B2B.',
			},
		},
		{
			slug: 'social-media-tool',
			icon: React.createElement(FaMobileAlt, { className: 'text-2xl' }),
			en: {
				title: 'Social Media Management Tool',
				description: 'Privacy policy for the internal social media scheduling and management tool.',
			},
			'pt-BR': {
				title: 'Ferramenta de Gestão de Mídias Sociais',
				description: 'Política de privacidade da ferramenta interna de agendamento e gestão de mídias sociais.',
			},
		},
		{
			slug: 'newsletter',
			icon: React.createElement(FaEnvelopeOpenText, { className: 'text-2xl' }),
			en: {
				title: 'Newsletter',
				description: 'How we handle subscriber data for our Bugsletter.',
			},
			'pt-BR': {
				title: 'Newsletter',
				description: 'Como tratamos dados de assinantes da nossa Bugsletter.',
			},
		},
	],
};

// ---------------------------------------------------------------------------
// /privacy/services
// ---------------------------------------------------------------------------

const contactLink = React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br');

export const servicesPrivacy: LegalPageContent = {
	en: {
		title: 'B2B Infrastructure Services — Privacy Policy',
		lastUpdated: 'Last updated: April 1st 2026',
		sections: [
			{
				title: '1. Data We Collect',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'When you submit a quote request through the Infra Builder, we collect:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Contact information:'), ' your name, email address, and optionally your studio name and website.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Quote content:'), ' selected services, configurations, custom field inputs, preferred currency, and maintenance period.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Technical metadata:'), ' IP address hash (anonymized), user agent, submission timestamp, and locale preference.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Attribution data:'), ' referral parameter (e.g., from QR codes or campaign links).')),
					),
				),
			},
			{
				title: '2. How We Use Your Data',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, 'To process and respond to your quote request.'),
					React.createElement('li', null, 'To send you the quote confirmation email and any follow-up communications related to your request.'),
					React.createElement('li', null, 'To create a shareable quote URL for your reference.'),
					React.createElement('li', null, 'For internal CRM management and business analytics.'),
					React.createElement('li', null, 'To detect and prevent abuse (rate limiting, honeypot verification).'),
				),
			},
			{
				title: '3. Third-Party Processors',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Your data may be processed by the following third-party services:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Supabase'), ' (database hosting) — stores quote data. Servers in the US.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Brevo'), ' (transactional email) — sends confirmation and response emails.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Twenty CRM'), ' (self-hosted) — manages client relationships and opportunities.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Discord'), ' (webhooks) — internal notifications only; no personal data is shared in public channels.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Upstash'), ' (rate limiting) — processes anonymized request identifiers.')),
					),
				),
			},
			{
				title: '4. Data Retention',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, 'Quote data is retained for 2 years from the date of submission, or until the associated business relationship concludes, whichever is later.'),
					React.createElement('li', null, 'Expired quotes (not responded to within 30 days) are retained for analytics but marked as expired.'),
					React.createElement('li', null, 'You may request deletion of your data at any time (see Section 6).'),
				),
			},
			{
				title: '5. Cookies',
				content: React.createElement('p', null,
					'The Infra Builder uses a single HTTP-only session cookie (',
					React.createElement('code', null, 'mib_quote_session'),
					') to facilitate the post-submission redirect flow. This cookie is cleared immediately after use and does not track you across sessions.',
				),
			},
			{
				title: '6. Your Rights',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Under the LGPD (Brazil) and GDPR (EU), you have the right to:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, 'Access the personal data we hold about you.'),
						React.createElement('li', null, 'Request correction of inaccurate data.'),
						React.createElement('li', null, 'Request deletion of your data.'),
						React.createElement('li', null, 'Object to or restrict processing.'),
						React.createElement('li', null, 'Request data portability.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'To exercise any of these rights, contact us at ', contactLink, '. We will respond within 15 business days.'),
				),
			},
			{
				title: '7. Security',
				content: React.createElement('p', null, 'We implement appropriate technical measures to protect your data, including HMAC-signed URLs, encrypted database connections, and server-side-only access to sensitive operations.'),
			},
			{
				title: '8. Contact',
				content: React.createElement('p', null, 'Data controller: Made in Bugs', React.createElement('br'), 'Contact: ', contactLink),
			},
		],
	},
	'pt-BR': {
		title: 'Serviços de Infraestrutura B2B — Política de Privacidade',
		lastUpdated: 'Última atualização: 1 de abril de 2026',
		sections: [
			{
				title: '1. Dados que Coletamos',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Quando você envia uma solicitação de orçamento pelo Infra Builder, coletamos:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Informações de contato:'), ' seu nome, endereço de e-mail e, opcionalmente, nome do estúdio e website.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Conteúdo do orçamento:'), ' serviços selecionados, configurações, campos personalizados, moeda preferida e período de manutenção.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Metadados técnicos:'), ' hash do endereço IP (anonimizado), user agent, timestamp de envio e preferência de idioma.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Dados de atribuição:'), ' parâmetro de referência (ex.: QR codes ou links de campanha).')),
					),
				),
			},
			{
				title: '2. Como Usamos Seus Dados',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, 'Para processar e responder à sua solicitação de orçamento.'),
					React.createElement('li', null, 'Para enviar o e-mail de confirmação do orçamento e comunicações de acompanhamento relacionadas.'),
					React.createElement('li', null, 'Para criar uma URL compartilhável do orçamento para sua referência.'),
					React.createElement('li', null, 'Para gestão interna de CRM e análise de negócios.'),
					React.createElement('li', null, 'Para detectar e prevenir abusos (limitação de taxa, verificação de honeypot).'),
				),
			},
			{
				title: '3. Processadores Terceirizados',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Seus dados podem ser processados pelos seguintes serviços terceirizados:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Supabase'), ' (hospedagem de banco de dados) — armazena dados de orçamentos. Servidores nos EUA.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Brevo'), ' (e-mail transacional) — envia e-mails de confirmação e resposta.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Twenty CRM'), ' (auto-hospedado) — gerencia relacionamentos e oportunidades de clientes.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Discord'), ' (webhooks) — apenas notificações internas; nenhum dado pessoal é compartilhado em canais públicos.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Upstash'), ' (limitação de taxa) — processa identificadores de requisição anonimizados.')),
					),
				),
			},
			{
				title: '4. Retenção de Dados',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, 'Dados de orçamento são retidos por 2 anos a partir da data de envio, ou até a conclusão do relacionamento comercial associado, o que ocorrer por último.'),
					React.createElement('li', null, 'Orçamentos expirados (sem resposta em 30 dias) são mantidos para análise, mas marcados como expirados.'),
					React.createElement('li', null, 'Você pode solicitar a exclusão dos seus dados a qualquer momento (veja Seção 6).'),
				),
			},
			{
				title: '5. Cookies',
				content: React.createElement('p', null,
					'O Infra Builder usa um único cookie de sessão HTTP-only (',
					React.createElement('code', null, 'mib_quote_session'),
					') para facilitar o fluxo de redirecionamento pós-envio. Este cookie é limpo imediatamente após o uso e não rastreia você entre sessões.',
				),
			},
			{
				title: '6. Seus Direitos',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Sob a LGPD (Brasil) e o GDPR (UE), você tem o direito de:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, 'Acessar os dados pessoais que mantemos sobre você.'),
						React.createElement('li', null, 'Solicitar correção de dados imprecisos.'),
						React.createElement('li', null, 'Solicitar exclusão dos seus dados.'),
						React.createElement('li', null, 'Opor-se ou restringir o processamento.'),
						React.createElement('li', null, 'Solicitar portabilidade dos dados.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'Para exercer qualquer um desses direitos, entre em contato pelo ', contactLink, '. Responderemos em até 15 dias úteis.'),
				),
			},
			{
				title: '7. Segurança',
				content: React.createElement('p', null, 'Implementamos medidas técnicas apropriadas para proteger seus dados, incluindo URLs assinadas com HMAC, conexões de banco de dados criptografadas e acesso exclusivamente server-side a operações sensíveis.'),
			},
			{
				title: '8. Contato',
				content: React.createElement('p', null, 'Controlador de dados: Made in Bugs', React.createElement('br'), 'Contato: ', contactLink),
			},
		],
	},
};

// ---------------------------------------------------------------------------
// /privacy/social-media-tool
// ---------------------------------------------------------------------------

export const socialMediaToolPrivacy: LegalPageContent = {
	en: {
		title: 'Social Media Management Tool — Privacy Policy',
		lastUpdated: 'Last updated: April 10th 2026',
		sections: [
			{
				title: '',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'This application is an internal tool used by Made in Bugs for social media management purposes.'),
					React.createElement('p', null, 'We do not collect, store, or share any personal data from third-party users. This app only accesses our own accounts.'),
					React.createElement('p', null, 'Contact: ', contactLink),
				),
			},
		],
	},
	'pt-BR': {
		title: 'Ferramenta de Gestão de Mídias Sociais — Política de Privacidade',
		lastUpdated: 'Última atualização: 10 de abril de 2026',
		sections: [
			{
				title: '',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Esta aplicação é uma ferramenta interna usada pela Made in Bugs para fins de gestão de mídias sociais.'),
					React.createElement('p', null, 'Não coletamos, armazenamos ou compartilhamos dados pessoais de usuários terceiros. Este aplicativo acessa apenas nossas próprias contas.'),
					React.createElement('p', null, 'Contato: ', contactLink),
				),
			},
		],
	},
};

// ---------------------------------------------------------------------------
// /privacy/newsletter
// ---------------------------------------------------------------------------

export const newsletterPrivacy: LegalPageContent = {
	en: {
		title: 'Newsletter (Bugsletter) — Privacy Policy',
		lastUpdated: 'Last updated: April 10th 2026',
		sections: [
			{
				title: '1. Data We Collect',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'When you subscribe to the Bugsletter, we collect:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Email address:'), ' required for sending the newsletter.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Subscription timestamp:'), ' when you signed up.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Locale preference:'), ' your language preference at the time of subscription.')),
					),
				),
			},
			{
				title: '2. How We Use Your Data',
				content: React.createElement(React.Fragment, null,
					React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'To send you the Bugsletter with studio updates, game development news, and playtest invitations.'),
						React.createElement('li', null, 'To manage our mailing list and process unsubscribe requests.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'We do not sell, share, or trade your email address with any third parties for marketing purposes.'),
				),
			},
			{
				title: '3. Third-Party Processors',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Brevo'), " — our email delivery service. Processes your email address to send newsletters. Subject to Brevo's privacy policy.")),
					React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Supabase'), ' — stores subscription data securely.')),
				),
			},
			{
				title: '4. Data Retention',
				content: React.createElement('p', null, 'Your email address is retained as long as your subscription is active. Upon unsubscribing, your data is deleted within 30 days.'),
			},
			{
				title: '5. Your Rights',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Under the LGPD (Brazil) and GDPR (EU), you have the right to:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, 'Unsubscribe at any time via the link in every email.'),
						React.createElement('li', null, 'Request access to or deletion of your data.'),
						React.createElement('li', null, 'Object to processing.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'Contact us at ', contactLink, ' for any data requests.'),
				),
			},
			{
				title: '6. Contact',
				content: React.createElement('p', null, 'Data controller: Made in Bugs', React.createElement('br'), 'Contact: ', contactLink),
			},
		],
	},
	'pt-BR': {
		title: 'Newsletter (Bugsletter) — Política de Privacidade',
		lastUpdated: 'Última atualização: 10 de abril de 2026',
		sections: [
			{
				title: '1. Dados que Coletamos',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Ao assinar a Bugsletter, coletamos:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Endereço de e-mail:'), ' necessário para o envio da newsletter.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Timestamp da assinatura:'), ' quando você se inscreveu.')),
						React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Preferência de idioma:'), ' seu idioma no momento da assinatura.')),
					),
				),
			},
			{
				title: '2. Como Usamos Seus Dados',
				content: React.createElement(React.Fragment, null,
					React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Para enviar a Bugsletter com atualizações do estúdio, novidades sobre desenvolvimento de jogos e convites para playtests.'),
						React.createElement('li', null, 'Para gerenciar nossa lista de e-mails e processar solicitações de cancelamento.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'Não vendemos, compartilhamos ou trocamos seu endereço de e-mail com terceiros para fins de marketing.'),
				),
			},
			{
				title: '3. Processadores Terceirizados',
				content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
					React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Brevo'), ' — nosso serviço de entrega de e-mail. Processa seu endereço de e-mail para enviar newsletters. Sujeito à política de privacidade do Brevo.')),
					React.createElement('li', null, React.createElement(React.Fragment, null, React.createElement('strong', null, 'Supabase'), ' — armazena dados de assinatura com segurança.')),
				),
			},
			{
				title: '4. Retenção de Dados',
				content: React.createElement('p', null, 'Seu endereço de e-mail é mantido enquanto sua assinatura estiver ativa. Após o cancelamento, seus dados são excluídos em até 30 dias.'),
			},
			{
				title: '5. Seus Direitos',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Sob a LGPD (Brasil) e o GDPR (UE), você tem o direito de:'),
					React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
						React.createElement('li', null, 'Cancelar a assinatura a qualquer momento pelo link presente em cada e-mail.'),
						React.createElement('li', null, 'Solicitar acesso ou exclusão dos seus dados.'),
						React.createElement('li', null, 'Opor-se ao processamento.'),
					),
					React.createElement('p', { className: 'mt-2' }, 'Entre em contato pelo ', contactLink, ' para qualquer solicitação referente aos seus dados.'),
				),
			},
			{
				title: '6. Contato',
				content: React.createElement('p', null, 'Controlador de dados: Made in Bugs', React.createElement('br'), 'Contato: ', contactLink),
			},
		],
	},
};
