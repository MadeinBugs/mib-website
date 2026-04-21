import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import ContentLayout from '../../../../components/ContentLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: locale === 'en'
			? 'B2B Services Privacy Policy — Made in Bugs'
			: 'Política de Privacidade — Serviços B2B — Made in Bugs',
	};
}

export default async function ServicesPrivacyPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	if (locale === 'en') {
		return (
			<ContentLayout translations={t} locale={locale}>
				<main className="min-h-screen py-16 px-6">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							B2B Infrastructure Services — Privacy Policy
						</h1>
						<p className="text-sm text-neutral-500 mb-10">Last updated: April 1st 2026</p>

						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Data We Collect</h2>
								<p>When you submit a quote request through the Infra Builder, we collect:</p>
								<ul className="list-disc list-inside space-y-2 mt-2">
									<li><strong>Contact information:</strong> your name, email address, and optionally your studio name and website.</li>
									<li><strong>Quote content:</strong> selected services, configurations, custom field inputs, preferred currency, and maintenance period.</li>
									<li><strong>Technical metadata:</strong> IP address hash (anonymized), user agent, submission timestamp, and locale preference.</li>
									<li><strong>Attribution data:</strong> referral parameter (e.g., from QR codes or campaign links).</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. How We Use Your Data</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>To process and respond to your quote request.</li>
									<li>To send you the quote confirmation email and any follow-up communications related to your request.</li>
									<li>To create a shareable quote URL for your reference.</li>
									<li>For internal CRM management and business analytics.</li>
									<li>To detect and prevent abuse (rate limiting, honeypot verification).</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Third-Party Processors</h2>
								<p>Your data may be processed by the following third-party services:</p>
								<ul className="list-disc list-inside space-y-2 mt-2">
									<li><strong>Supabase</strong> (database hosting) — stores quote data. Servers in the US.</li>
									<li><strong>Brevo</strong> (transactional email) — sends confirmation and response emails.</li>
									<li><strong>Twenty CRM</strong> (self-hosted) — manages client relationships and opportunities.</li>
									<li><strong>Discord</strong> (webhooks) — internal notifications only; no personal data is shared in public channels.</li>
									<li><strong>Upstash</strong> (rate limiting) — processes anonymized request identifiers.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Data Retention</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Quote data is retained for 2 years from the date of submission, or until the associated business relationship concludes, whichever is later.</li>
									<li>Expired quotes (not responded to within 30 days) are retained for analytics but marked as expired.</li>
									<li>You may request deletion of your data at any time (see Section 6).</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Cookies</h2>
								<p>
									The Infra Builder uses a single HTTP-only session cookie (<code>mib_quote_session</code>)
									to facilitate the post-submission redirect flow. This cookie is cleared immediately after
									use and does not track you across sessions.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Your Rights</h2>
								<p>Under the LGPD (Brazil) and GDPR (EU), you have the right to:</p>
								<ul className="list-disc list-inside space-y-2 mt-2">
									<li>Access the personal data we hold about you.</li>
									<li>Request correction of inaccurate data.</li>
									<li>Request deletion of your data.</li>
									<li>Object to or restrict processing.</li>
									<li>Request data portability.</li>
								</ul>
								<p className="mt-2">
									To exercise any of these rights, contact us at{' '}
									<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
										andress@madeinbugs.com.br
									</a>.
									We will respond within 15 business days.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">7. Security</h2>
								<p>
									We implement appropriate technical measures to protect your data,
									including HMAC-signed URLs, encrypted database connections, and
									server-side-only access to sensitive operations.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">8. Contact</h2>
								<p>
									Data controller: Made in Bugs<br />
									Contact:{' '}
									<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
										andress@madeinbugs.com.br
									</a>
								</p>
							</section>
						</div>

						<div className="mt-12 pt-6 border-t border-neutral-200">
							<Link href={`/${locale}/privacy`} className="text-sm text-neutral-500 hover:text-amber-700 transition-colors">
								← Back to Privacy index
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
						Serviços de Infraestrutura B2B — Política de Privacidade
					</h1>
					<p className="text-sm text-neutral-500 mb-10">Última atualização: 1 de abril de 2026</p>

					<div className="space-y-8 text-neutral-700 leading-relaxed">
						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Dados que Coletamos</h2>
							<p>Quando você envia uma solicitação de orçamento pelo Infra Builder, coletamos:</p>
							<ul className="list-disc list-inside space-y-2 mt-2">
								<li><strong>Informações de contato:</strong> seu nome, endereço de e-mail e, opcionalmente, nome do estúdio e website.</li>
								<li><strong>Conteúdo do orçamento:</strong> serviços selecionados, configurações, campos personalizados, moeda preferida e período de manutenção.</li>
								<li><strong>Metadados técnicos:</strong> hash do endereço IP (anonimizado), user agent, timestamp de envio e preferência de idioma.</li>
								<li><strong>Dados de atribuição:</strong> parâmetro de referência (ex.: QR codes ou links de campanha).</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Como Usamos Seus Dados</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>Para processar e responder à sua solicitação de orçamento.</li>
								<li>Para enviar o e-mail de confirmação do orçamento e comunicações de acompanhamento relacionadas.</li>
								<li>Para criar uma URL compartilhável do orçamento para sua referência.</li>
								<li>Para gestão interna de CRM e análise de negócios.</li>
								<li>Para detectar e prevenir abusos (limitação de taxa, verificação de honeypot).</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Processadores Terceirizados</h2>
							<p>Seus dados podem ser processados pelos seguintes serviços terceirizados:</p>
							<ul className="list-disc list-inside space-y-2 mt-2">
								<li><strong>Supabase</strong> (hospedagem de banco de dados) — armazena dados de orçamentos. Servidores nos EUA.</li>
								<li><strong>Brevo</strong> (e-mail transacional) — envia e-mails de confirmação e resposta.</li>
								<li><strong>Twenty CRM</strong> (auto-hospedado) — gerencia relacionamentos e oportunidades de clientes.</li>
								<li><strong>Discord</strong> (webhooks) — apenas notificações internas; nenhum dado pessoal é compartilhado em canais públicos.</li>
								<li><strong>Upstash</strong> (limitação de taxa) — processa identificadores de requisição anonimizados.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Retenção de Dados</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>Dados de orçamento são retidos por 2 anos a partir da data de envio, ou até a conclusão do relacionamento comercial associado, o que ocorrer por último.</li>
								<li>Orçamentos expirados (sem resposta em 30 dias) são mantidos para análise, mas marcados como expirados.</li>
								<li>Você pode solicitar a exclusão dos seus dados a qualquer momento (veja Seção 6).</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Cookies</h2>
							<p>
								O Infra Builder usa um único cookie de sessão HTTP-only (<code>mib_quote_session</code>)
								para facilitar o fluxo de redirecionamento pós-envio. Este cookie é limpo imediatamente
								após o uso e não rastreia você entre sessões.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Seus Direitos</h2>
							<p>Sob a LGPD (Brasil) e o GDPR (UE), você tem o direito de:</p>
							<ul className="list-disc list-inside space-y-2 mt-2">
								<li>Acessar os dados pessoais que mantemos sobre você.</li>
								<li>Solicitar correção de dados imprecisos.</li>
								<li>Solicitar exclusão dos seus dados.</li>
								<li>Opor-se ou restringir o processamento.</li>
								<li>Solicitar portabilidade dos dados.</li>
							</ul>
							<p className="mt-2">
								Para exercer qualquer um desses direitos, entre em contato pelo{' '}
								<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
									andress@madeinbugs.com.br
								</a>.
								Responderemos em até 15 dias úteis.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">7. Segurança</h2>
							<p>
								Implementamos medidas técnicas apropriadas para proteger seus dados,
								incluindo URLs assinadas com HMAC, conexões de banco de dados criptografadas
								e acesso exclusivamente server-side a operações sensíveis.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">8. Contato</h2>
							<p>
								Controlador de dados: Made in Bugs<br />
								Contato:{' '}
								<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
									andress@madeinbugs.com.br
								</a>
							</p>
						</section>
					</div>

					<div className="mt-12 pt-6 border-t border-neutral-200">
						<Link href={`/${locale}/privacy`} className="text-sm text-neutral-500 hover:text-amber-700 transition-colors">
							← Voltar ao índice de Privacidade
						</Link>
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
