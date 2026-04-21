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
			? 'Newsletter Privacy Policy — Made in Bugs'
			: 'Política de Privacidade da Newsletter — Made in Bugs',
	};
}

export default async function NewsletterPrivacyPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	if (locale === 'en') {
		return (
			<ContentLayout translations={t} locale={locale}>
				<main className="min-h-screen py-16 px-6">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							Newsletter (Bugsletter) — Privacy Policy
						</h1>
						<p className="text-sm text-neutral-500 mb-10">Last updated: April 10th 2026</p>

						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Data We Collect</h2>
								<p>When you subscribe to the Bugsletter, we collect:</p>
								<ul className="list-disc list-inside space-y-2 mt-2">
									<li><strong>Email address:</strong> required for sending the newsletter.</li>
									<li><strong>Subscription timestamp:</strong> when you signed up.</li>
									<li><strong>Locale preference:</strong> your language preference at the time of subscription.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. How We Use Your Data</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>To send you the Bugsletter with studio updates, game development news, and playtest invitations.</li>
									<li>To manage our mailing list and process unsubscribe requests.</li>
								</ul>
								<p className="mt-2">We do not sell, share, or trade your email address with any third parties for marketing purposes.</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Third-Party Processors</h2>
								<ul className="list-disc list-inside space-y-2">
									<li><strong>Brevo</strong> — our email delivery service. Processes your email address to send newsletters. Subject to Brevo&apos;s privacy policy.</li>
									<li><strong>Supabase</strong> — stores subscription data securely.</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Data Retention</h2>
								<p>
									Your email address is retained as long as your subscription is active.
									Upon unsubscribing, your data is deleted within 30 days.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Your Rights</h2>
								<p>Under the LGPD (Brazil) and GDPR (EU), you have the right to:</p>
								<ul className="list-disc list-inside space-y-2 mt-2">
									<li>Unsubscribe at any time via the link in every email.</li>
									<li>Request access to or deletion of your data.</li>
									<li>Object to processing.</li>
								</ul>
								<p className="mt-2">
									Contact us at{' '}
									<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
										andress@madeinbugs.com.br
									</a>{' '}
									for any data requests.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Contact</h2>
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
						Newsletter (Bugsletter) — Política de Privacidade
					</h1>
					<p className="text-sm text-neutral-500 mb-10">Última atualização: 10 de abril de 2026</p>

					<div className="space-y-8 text-neutral-700 leading-relaxed">
						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Dados que Coletamos</h2>
							<p>Ao assinar a Bugsletter, coletamos:</p>
							<ul className="list-disc list-inside space-y-2 mt-2">
								<li><strong>Endereço de e-mail:</strong> necessário para o envio da newsletter.</li>
								<li><strong>Timestamp da assinatura:</strong> quando você se inscreveu.</li>
								<li><strong>Preferência de idioma:</strong> seu idioma no momento da assinatura.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Como Usamos Seus Dados</h2>
							<ul className="list-disc list-inside space-y-2">
								<li>Para enviar a Bugsletter com atualizações do estúdio, novidades sobre desenvolvimento de jogos e convites para playtests.</li>
								<li>Para gerenciar nossa lista de e-mails e processar solicitações de cancelamento.</li>
							</ul>
							<p className="mt-2">Não vendemos, compartilhamos ou trocamos seu endereço de e-mail com terceiros para fins de marketing.</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Processadores Terceirizados</h2>
							<ul className="list-disc list-inside space-y-2">
								<li><strong>Brevo</strong> — nosso serviço de entrega de e-mail. Processa seu endereço de e-mail para enviar newsletters. Sujeito à política de privacidade do Brevo.</li>
								<li><strong>Supabase</strong> — armazena dados de assinatura com segurança.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Retenção de Dados</h2>
							<p>
								Seu endereço de e-mail é mantido enquanto sua assinatura estiver ativa.
								Após o cancelamento, seus dados são excluídos em até 30 dias.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Seus Direitos</h2>
							<p>Sob a LGPD (Brasil) e o GDPR (UE), você tem o direito de:</p>
							<ul className="list-disc list-inside space-y-2 mt-2">
								<li>Cancelar a assinatura a qualquer momento pelo link presente em cada e-mail.</li>
								<li>Solicitar acesso ou exclusão dos seus dados.</li>
								<li>Opor-se ao processamento.</li>
							</ul>
							<p className="mt-2">
								Entre em contato pelo{' '}
								<a href="mailto:andress@madeinbugs.com.br" className="text-blue-600 hover:underline">
									andress@madeinbugs.com.br
								</a>{' '}
								para qualquer solicitação referente aos seus dados.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">6. Contato</h2>
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
