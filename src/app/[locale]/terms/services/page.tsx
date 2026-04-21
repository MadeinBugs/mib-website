import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import ContentLayout from '../../../../components/ContentLayout';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TERMS_VERSION } from '../../../../lib/services/defaults';
import { formatVersionDate } from '../../../../lib/services/format';
import type { Locale } from '../../../../lib/services/types';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'B2B Services Terms — Made in Bugs'
			: 'Termos de Serviços B2B — Made in Bugs',
	};
}

export default async function ServicesTermsPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);
	const versionDate = formatVersionDate(TERMS_VERSION, locale as Locale);

	if (locale === 'en') {
		return (
			<ContentLayout translations={t} locale={locale}>
				<main className="min-h-screen py-16 px-6">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							B2B Infrastructure Services — Terms of Service
						</h1>
						<p className="text-sm text-neutral-500 mb-10">
							Version: {TERMS_VERSION} · Last updated: {versionDate}
						</p>

						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Overview</h2>
								<p>
									These terms govern the use of the Infra Builder quote system and
									any B2B infrastructure service engagements provided by Made in Bugs
									(&quot;we&quot;, &quot;us&quot;, &quot;the Studio&quot;).
								</p>
								<p className="mt-2">
									By submitting a quote request through the Infra Builder, you
									(&quot;the Client&quot;) agree to these terms.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Quote Requests</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Quote requests are non-binding. Submitting a request does not create a contract or obligation on either party.</li>
									<li>Prices displayed in the builder are estimates and may change based on project complexity, scope discussions, or currency fluctuations.</li>
									<li>Quotes are valid for 30 days from the date of submission unless otherwise stated in our response.</li>
									<li>Services marked as &quot;pending pricing&quot; require manual assessment and are not included in the automated total.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Service Delivery</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Service scope, timelines, and deliverables will be formalized in a separate service agreement after quote acceptance.</li>
									<li>The Studio reserves the right to decline any engagement at its sole discretion.</li>
									<li>Third-party costs (hosting, domains, SaaS subscriptions) are the Client&apos;s responsibility unless explicitly included in the quote.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Maintenance</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Maintenance contracts, if selected, begin after the initial setup is delivered and accepted.</li>
									<li>Standard maintenance scope: monitoring, security updates, minor bug fixes, and up to 2 hours of configuration changes per month.</li>
									<li>Maintenance does not include new feature development unless agreed upon separately.</li>
									<li>Either party may terminate maintenance with 30 days written notice.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Intellectual Property</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Configuration and setup work performed by the Studio becomes the Client&apos;s property upon full payment.</li>
									<li>The Studio retains the right to use general knowledge gained during the engagement for future projects.</li>
									<li>Open-source tools deployed remain under their respective licenses.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Liability</h2>
								<p>
									The Studio&apos;s total liability is limited to the amount paid for the specific service in question.
									We are not liable for indirect, incidental, or consequential damages, including lost revenue or data.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">7. Governing Law</h2>
								<p>
									These terms are governed by the laws of Brazil. Any disputes
									shall be resolved in the courts of São Paulo, SP.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">8. Changes to These Terms</h2>
								<p>
									We may update these terms from time to time. The version number
									at the top of this page indicates the current version. Continued
									use of the Infra Builder after changes constitutes acceptance.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">9. Contact</h2>
								<p>
									Questions about these terms? Contact us at{' '}
									<a
										href="mailto:andress@madeinbugs.com.br"
										className="text-blue-600 hover:underline"
									>
										andress@madeinbugs.com.br
									</a>
								</p>
							</section>
						</div>

						<div className="mt-12 pt-6 border-t border-neutral-200">
							<Link href={`/${locale}/terms`} className="text-sm text-neutral-500 hover:text-amber-700 transition-colors">
								{t.legal.backToTerms}
							</Link>
						</div>
					</div>
				</main>
			</ContentLayout>
		);
	}

	// pt-BR
	return (
		<ContentLayout translations={t} locale={locale}>
			<main className="min-h-screen py-16 px-6">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						Serviços de Infraestrutura B2B — Termos de Serviço
					</h1>
					<p className="text-sm text-neutral-500 mb-10">
						Versão: {TERMS_VERSION} · Última atualização: {versionDate}
					</p>

					<div className="space-y-8 text-neutral-700 leading-relaxed">
						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Visão Geral</h2>
							<p>
								Estes termos regem o uso do sistema de orçamentos Infra Builder e
								quaisquer prestações de serviços de infraestrutura B2B fornecidos
								pela Made in Bugs (&quot;nós&quot;, &quot;o Estúdio&quot;).
							</p>
							<p className="mt-2">
								Ao enviar uma solicitação de orçamento pelo Infra Builder, você
								(&quot;o Cliente&quot;) concorda com estes termos.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Solicitações de Orçamento</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>Solicitações de orçamento não são vinculantes. Enviar uma solicitação não cria contrato ou obrigação para nenhuma das partes.</li>
								<li>Os preços exibidos no builder são estimativas e podem mudar conforme a complexidade do projeto, discussões de escopo ou variações cambiais.</li>
								<li>Os orçamentos são válidos por 30 dias a partir da data de envio, salvo indicação contrária em nossa resposta.</li>
								<li>Serviços marcados como &quot;preço sob consulta&quot; requerem avaliação manual e não estão incluídos no total automatizado.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Entrega dos Serviços</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>O escopo, prazos e entregáveis serão formalizados em um contrato de prestação de serviços separado após a aceitação do orçamento.</li>
								<li>O Estúdio se reserva o direito de recusar qualquer engajamento a seu exclusivo critério.</li>
								<li>Custos de terceiros (hospedagem, domínios, assinaturas SaaS) são responsabilidade do Cliente, salvo quando explicitamente incluídos no orçamento.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Manutenção</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>Contratos de manutenção, se selecionados, começam após a entrega e aceite da configuração inicial.</li>
								<li>Escopo padrão de manutenção: monitoramento, atualizações de segurança, correções pontuais e até 2 horas de ajustes de configuração por mês.</li>
								<li>A manutenção não inclui desenvolvimento de novas funcionalidades, salvo acordo em separado.</li>
								<li>Qualquer parte pode encerrar a manutenção com 30 dias de aviso prévio por escrito.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Propriedade Intelectual</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>O trabalho de configuração e setup realizado pelo Estúdio torna-se propriedade do Cliente após o pagamento integral.</li>
								<li>O Estúdio retém o direito de usar o conhecimento geral adquirido durante o engajamento em projetos futuros.</li>
								<li>Ferramentas open-source implantadas permanecem sob suas respectivas licenças.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Responsabilidade</h2>
							<p>
								A responsabilidade total do Estúdio é limitada ao valor pago pelo serviço específico em questão.
								Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais, incluindo perda de receita ou dados.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">7. Legislação Aplicável</h2>
							<p>
								Estes termos são regidos pelas leis do Brasil. Quaisquer disputas
								serão resolvidas nos tribunais de São Paulo, SP.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">8. Alterações nos Termos</h2>
							<p>
								Podemos atualizar estes termos periodicamente. O número da versão
								no topo desta página indica a versão atual. O uso continuado do
								Infra Builder após alterações constitui aceitação.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">9. Contato</h2>
							<p>
								Dúvidas sobre estes termos? Entre em contato pelo{' '}
								<a
									href="mailto:andress@madeinbugs.com.br"
									className="text-blue-600 hover:underline"
								>
									andress@madeinbugs.com.br
								</a>
							</p>
						</section>
					</div>

					<div className="mt-12 pt-6 border-t border-neutral-200">
						<Link href={`/${locale}/terms`} className="text-sm text-neutral-500 hover:text-amber-700 transition-colors">
							{t.legal.backToTerms}
						</Link>
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
