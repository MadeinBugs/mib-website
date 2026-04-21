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
			? 'Newsletter Terms — Made in Bugs'
			: 'Termos da Newsletter — Made in Bugs',
	};
}

export default async function NewsletterTermsPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	if (locale === 'en') {
		return (
			<ContentLayout translations={t} locale={locale}>
				<main className="min-h-screen py-16 px-6">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							Newsletter (Bugsletter) — Terms of Service
						</h1>
						<p className="text-sm text-neutral-500 mb-10">Last updated: April 10th 2026</p>

						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. What You&apos;re Signing Up For</h2>
								<p>
									By subscribing to the Bugsletter, you agree to receive periodic
									email communications from Made in Bugs. These emails may include
									studio updates, game development news, playtest invitations, and
									occasional promotional content.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Frequency</h2>
								<p>
									We aim to send emails no more than once per week. We will never
									spam you. Frequency may vary depending on studio activity.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Unsubscribe</h2>
								<p>
									Every email includes an unsubscribe link. You can opt out at any
									time. Unsubscribe requests are processed immediately.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Data Usage</h2>
								<p>
									We only collect your email address for the purpose of sending
									the newsletter. See our{' '}
									<Link href={`/${locale}/privacy/newsletter`} className="text-blue-600 hover:underline">
										Newsletter Privacy Policy
									</Link>{' '}
									for full details on data handling.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Contact</h2>
								<p>
									Questions? Contact us at{' '}
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
								← Back to Terms index
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
						Newsletter (Bugsletter) — Termos de Serviço
					</h1>
					<p className="text-sm text-neutral-500 mb-10">Última atualização: 10 de abril de 2026</p>

					<div className="space-y-8 text-neutral-700 leading-relaxed">
						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">1. O Que Você Está Assinando</h2>
							<p>
								Ao assinar a Bugsletter, você concorda em receber comunicações
								periódicas por e-mail da Made in Bugs. Esses e-mails podem incluir
								atualizações do estúdio, novidades sobre desenvolvimento de jogos,
								convites para playtests e conteúdo promocional eventual.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Frequência</h2>
							<p>
								Nosso objetivo é enviar e-mails no máximo uma vez por semana. Nunca
								enviaremos spam. A frequência pode variar conforme a atividade do estúdio.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Cancelamento</h2>
							<p>
								Todo e-mail inclui um link de cancelamento de assinatura. Você pode
								cancelar a qualquer momento. Solicitações de cancelamento são
								processadas imediatamente.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Uso dos Dados</h2>
							<p>
								Coletamos apenas seu endereço de e-mail para fins de envio da
								newsletter. Consulte nossa{' '}
								<Link href={`/${locale}/privacy/newsletter`} className="text-blue-600 hover:underline">
									Política de Privacidade da Newsletter
								</Link>{' '}
								para detalhes completos sobre o tratamento de dados.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Contato</h2>
							<p>
								Dúvidas? Entre em contato pelo{' '}
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
							← Voltar ao índice de Termos
						</Link>
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
