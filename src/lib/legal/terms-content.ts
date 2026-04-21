import React from 'react';
import { FaServer, FaMobileAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { TERMS_VERSION } from '../services/defaults';
import { formatVersionDate } from '../services/format';
import type { LegalIndexContent, LegalPageContent } from './types';

// ---------------------------------------------------------------------------
// Terms index
// ---------------------------------------------------------------------------

export const termsIndex: LegalIndexContent = {
	en: {
		title: 'Terms of Service',
		subtitle: 'Select the terms applicable to the product or service you are using.',
	},
	'pt-BR': {
		title: 'Termos de Serviço',
		subtitle: 'Selecione os termos aplicáveis ao produto ou serviço que você está utilizando.',
	},
	items: [
		{
			slug: 'services',
			icon: React.createElement(FaServer, { className: 'text-2xl' }),
			en: {
				title: 'B2B Infrastructure Services',
				description: 'Terms governing the Infra Builder quote system and B2B service engagements.',
			},
			'pt-BR': {
				title: 'Serviços de Infraestrutura B2B',
				description: 'Termos que regem o sistema de orçamentos do Infra Builder e prestação de serviços B2B.',
			},
		},
		{
			slug: 'social-media-tool',
			icon: React.createElement(FaMobileAlt, { className: 'text-2xl' }),
			en: {
				title: 'Social Media Management Tool',
				description: 'Terms for the internal social media scheduling and management tool.',
			},
			'pt-BR': {
				title: 'Ferramenta de Gestão de Mídias Sociais',
				description: 'Termos da ferramenta interna de agendamento e gestão de mídias sociais.',
			},
		},
		{
			slug: 'newsletter',
			icon: React.createElement(FaEnvelopeOpenText, { className: 'text-2xl' }),
			en: {
				title: 'Newsletter',
				description: 'Terms for our Bugsletter email communications.',
			},
			'pt-BR': {
				title: 'Newsletter',
				description: 'Termos das comunicações da nossa Bugsletter.',
			},
		},
	],
};

// ---------------------------------------------------------------------------
// /terms/services
// ---------------------------------------------------------------------------

export function getServicesTerms(): LegalPageContent {
	const enDate = formatVersionDate(TERMS_VERSION, 'en');
	const ptDate = formatVersionDate(TERMS_VERSION, 'pt-BR');

	return {
		en: {
			title: 'B2B Infrastructure Services — Terms of Service',
			lastUpdated: `Version: ${TERMS_VERSION} · Last updated: ${enDate}`,
			sections: [
				{
					title: '1. Overview',
					content: React.createElement(React.Fragment, null,
						React.createElement('p', null, 'These terms govern the use of the Infra Builder quote system and any B2B infrastructure service engagements provided by Made in Bugs ("we", "us", "the Studio").'),
						React.createElement('p', { className: 'mt-2' }, 'By submitting a quote request through the Infra Builder, you ("the Client") agree to these terms.'),
					),
				},
				{
					title: '2. Quote Requests',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Quote requests are non-binding. Submitting a request does not create a contract or obligation on either party.'),
						React.createElement('li', null, 'Prices displayed in the builder are estimates and may change based on project complexity, scope discussions, or currency fluctuations.'),
						React.createElement('li', null, 'Quotes are valid for 30 days from the date of submission unless otherwise stated in our response.'),
						React.createElement('li', null, 'Services marked as "pending pricing" require manual assessment and are not included in the automated total.'),
					),
				},
				{
					title: '3. Service Delivery',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Service scope, timelines, and deliverables will be formalized in a separate service agreement after quote acceptance.'),
						React.createElement('li', null, 'The Studio reserves the right to decline any engagement at its sole discretion.'),
						React.createElement('li', null, "Third-party costs (hosting, domains, SaaS subscriptions) are the Client's responsibility unless explicitly included in the quote."),
					),
				},
				{
					title: '4. Maintenance',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Maintenance contracts, if selected, begin after the initial setup is delivered and accepted.'),
						React.createElement('li', null, 'Standard maintenance scope: monitoring, security updates, minor bug fixes, and up to 2 hours of configuration changes per month.'),
						React.createElement('li', null, 'Maintenance does not include new feature development unless agreed upon separately.'),
						React.createElement('li', null, 'Either party may terminate maintenance with 30 days written notice.'),
					),
				},
				{
					title: '5. Intellectual Property',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, "Configuration and setup work performed by the Studio becomes the Client's property upon full payment."),
						React.createElement('li', null, 'The Studio retains the right to use general knowledge gained during the engagement for future projects.'),
						React.createElement('li', null, 'Open-source tools deployed remain under their respective licenses.'),
					),
				},
				{
					title: '6. Liability',
					content: React.createElement('p', null, "The Studio's total liability is limited to the amount paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages, including lost revenue or data."),
				},
				{
					title: '7. Governing Law',
					content: React.createElement('p', null, 'These terms are governed by the laws of Brazil. Any disputes shall be resolved in the courts of São Paulo, SP.'),
				},
				{
					title: '8. Changes to These Terms',
					content: React.createElement('p', null, 'We may update these terms from time to time. The version number at the top of this page indicates the current version. Continued use of the Infra Builder after changes constitutes acceptance.'),
				},
				{
					title: '9. Contact',
					content: React.createElement('p', null,
						'Questions about these terms? Contact us at ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				},
			],
		},
		'pt-BR': {
			title: 'Serviços de Infraestrutura B2B — Termos de Serviço',
			lastUpdated: `Versão: ${TERMS_VERSION} · Última atualização: ${ptDate}`,
			sections: [
				{
					title: '1. Visão Geral',
					content: React.createElement(React.Fragment, null,
						React.createElement('p', null, 'Estes termos regem o uso do sistema de orçamentos Infra Builder e quaisquer prestações de serviços de infraestrutura B2B fornecidos pela Made in Bugs ("nós", "o Estúdio").'),
						React.createElement('p', { className: 'mt-2' }, 'Ao enviar uma solicitação de orçamento pelo Infra Builder, você ("o Cliente") concorda com estes termos.'),
					),
				},
				{
					title: '2. Solicitações de Orçamento',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Solicitações de orçamento não são vinculantes. Enviar uma solicitação não cria contrato ou obrigação para nenhuma das partes.'),
						React.createElement('li', null, 'Os preços exibidos no builder são estimativas e podem mudar conforme a complexidade do projeto, discussões de escopo ou variações cambiais.'),
						React.createElement('li', null, 'Os orçamentos são válidos por 30 dias a partir da data de envio, salvo indicação contrária em nossa resposta.'),
						React.createElement('li', null, 'Serviços marcados como "preço sob consulta" requerem avaliação manual e não estão incluídos no total automatizado.'),
					),
				},
				{
					title: '3. Entrega dos Serviços',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'O escopo, prazos e entregáveis serão formalizados em um contrato de prestação de serviços separado após a aceitação do orçamento.'),
						React.createElement('li', null, 'O Estúdio se reserva o direito de recusar qualquer engajamento a seu exclusivo critério.'),
						React.createElement('li', null, 'Custos de terceiros (hospedagem, domínios, assinaturas SaaS) são responsabilidade do Cliente, salvo quando explicitamente incluídos no orçamento.'),
					),
				},
				{
					title: '4. Manutenção',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'Contratos de manutenção, se selecionados, começam após a entrega e aceite da configuração inicial.'),
						React.createElement('li', null, 'Escopo padrão de manutenção: monitoramento, atualizações de segurança, correções pontuais e até 2 horas de ajustes de configuração por mês.'),
						React.createElement('li', null, 'A manutenção não inclui desenvolvimento de novas funcionalidades, salvo acordo em separado.'),
						React.createElement('li', null, 'Qualquer parte pode encerrar a manutenção com 30 dias de aviso prévio por escrito.'),
					),
				},
				{
					title: '5. Propriedade Intelectual',
					content: React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
						React.createElement('li', null, 'O trabalho de configuração e setup realizado pelo Estúdio torna-se propriedade do Cliente após o pagamento integral.'),
						React.createElement('li', null, 'O Estúdio retém o direito de usar o conhecimento geral adquirido durante o engajamento em projetos futuros.'),
						React.createElement('li', null, 'Ferramentas open-source implantadas permanecem sob suas respectivas licenças.'),
					),
				},
				{
					title: '6. Responsabilidade',
					content: React.createElement('p', null, 'A responsabilidade total do Estúdio é limitada ao valor pago pelo serviço específico em questão. Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais, incluindo perda de receita ou dados.'),
				},
				{
					title: '7. Legislação Aplicável',
					content: React.createElement('p', null, 'Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas nos tribunais de São Paulo, SP.'),
				},
				{
					title: '8. Alterações nos Termos',
					content: React.createElement('p', null, 'Podemos atualizar estes termos periodicamente. O número da versão no topo desta página indica a versão atual. O uso continuado do Infra Builder após alterações constitui aceitação.'),
				},
				{
					title: '9. Contato',
					content: React.createElement('p', null,
						'Dúvidas sobre estes termos? Entre em contato pelo ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				},
			],
		},
	};
}

// ---------------------------------------------------------------------------
// /terms/social-media-tool
// ---------------------------------------------------------------------------

export const socialMediaToolTerms: LegalPageContent = {
	en: {
		title: 'Social Media Management Tool — Terms of Service',
		lastUpdated: 'Last updated: April 10th 2026',
		sections: [
			{
				title: '',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'This application is an internal tool used by Made in Bugs to manage and schedule social media content on our own accounts.'),
					React.createElement('p', null, 'This app is not available to the general public.'),
					React.createElement('p', null,
						'Contact: ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				),
			},
		],
	},
	'pt-BR': {
		title: 'Ferramenta de Gestão de Mídias Sociais — Termos de Serviço',
		lastUpdated: 'Última atualização: 10 de abril de 2026',
		sections: [
			{
				title: '',
				content: React.createElement(React.Fragment, null,
					React.createElement('p', null, 'Esta aplicação é uma ferramenta interna usada pela Made in Bugs para gerenciar e agendar conteúdo de mídias sociais em nossas próprias contas.'),
					React.createElement('p', null, 'Este aplicativo não está disponível ao público geral.'),
					React.createElement('p', null,
						'Contato: ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				),
			},
		],
	},
};

// ---------------------------------------------------------------------------
// /terms/newsletter
// ---------------------------------------------------------------------------

export function getNewsletterTerms(locale: 'en' | 'pt-BR', privacyHref: string): LegalPageContent {
	return {
		en: {
			title: 'Newsletter (Bugsletter) — Terms of Service',
			lastUpdated: 'Last updated: April 10th 2026',
			sections: [
				{
					title: "1. What You're Signing Up For",
					content: React.createElement('p', null, 'By subscribing to the Bugsletter, you agree to receive periodic email communications from Made in Bugs. These emails may include studio updates, game development news, playtest invitations, and occasional promotional content.'),
				},
				{
					title: '2. Frequency',
					content: React.createElement('p', null, 'We aim to send emails no more than once per week. We will never spam you. Frequency may vary depending on studio activity.'),
				},
				{
					title: '3. Unsubscribe',
					content: React.createElement('p', null, 'Every email includes an unsubscribe link. You can opt out at any time. Unsubscribe requests are processed immediately.'),
				},
				{
					title: '4. Data Usage',
					content: React.createElement('p', null,
						'We only collect your email address for the purpose of sending the newsletter. See our ',
						React.createElement('a', { href: privacyHref, className: 'text-blue-600 hover:underline' },
							locale === 'en' ? 'Newsletter Privacy Policy' : 'Política de Privacidade da Newsletter',
						),
						' for full details on data handling.',
					),
				},
				{
					title: '5. Contact',
					content: React.createElement('p', null,
						'Questions? Contact us at ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				},
			],
		},
		'pt-BR': {
			title: 'Newsletter (Bugsletter) — Termos de Serviço',
			lastUpdated: 'Última atualização: 10 de abril de 2026',
			sections: [
				{
					title: '1. O Que Você Está Assinando',
					content: React.createElement('p', null, 'Ao assinar a Bugsletter, você concorda em receber comunicações periódicas por e-mail da Made in Bugs. Esses e-mails podem incluir atualizações do estúdio, novidades sobre desenvolvimento de jogos, convites para playtests e conteúdo promocional eventual.'),
				},
				{
					title: '2. Frequência',
					content: React.createElement('p', null, 'Nosso objetivo é enviar e-mails no máximo uma vez por semana. Nunca enviaremos spam. A frequência pode variar conforme a atividade do estúdio.'),
				},
				{
					title: '3. Cancelamento',
					content: React.createElement('p', null, 'Todo e-mail inclui um link de cancelamento de assinatura. Você pode cancelar a qualquer momento. Solicitações de cancelamento são processadas imediatamente.'),
				},
				{
					title: '4. Uso dos Dados',
					content: React.createElement('p', null,
						'Coletamos apenas seu endereço de e-mail para fins de envio da newsletter. Consulte nossa ',
						React.createElement('a', { href: privacyHref, className: 'text-blue-600 hover:underline' },
							locale === 'en' ? 'Newsletter Privacy Policy' : 'Política de Privacidade da Newsletter',
						),
						' para detalhes completos sobre o tratamento de dados.',
					),
				},
				{
					title: '5. Contato',
					content: React.createElement('p', null,
						'Dúvidas? Entre em contato pelo ',
						React.createElement('a', { href: 'mailto:andress@madeinbugs.com.br', className: 'text-blue-600 hover:underline' }, 'andress@madeinbugs.com.br'),
					),
				},
			],
		},
	};
}
