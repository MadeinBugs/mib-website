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
			? 'Social Media Tool Privacy Policy — Made in Bugs'
			: 'Política de Privacidade — Ferramenta de Mídias Sociais — Made in Bugs',
	};
}

export default async function SocialMediaToolPrivacyPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const t = await getTranslations(locale);

	if (locale === 'en') {
		return (
			<ContentLayout translations={t} locale={locale}>
				<main className="min-h-screen py-16 px-6">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							Social Media Management Tool — Privacy Policy
						</h1>
						<p className="text-sm text-neutral-500 mb-10">Last updated: April 10th 2026</p>

						<div className="space-y-6 text-neutral-700 leading-relaxed">
							<p>
								This application is an internal tool used by Made in Bugs for social
								media management purposes.
							</p>
							<p>
								We do not collect, store, or share any personal data from third-party
								users. This app only accesses our own accounts.
							</p>
							<p>
								Contact:{' '}
								<a
									href="mailto:andress@madeinbugs.com.br"
									className="text-blue-600 hover:underline"
								>
									andress@madeinbugs.com.br
								</a>
							</p>
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
						Ferramenta de Gestão de Mídias Sociais — Política de Privacidade
					</h1>
					<p className="text-sm text-neutral-500 mb-10">Última atualização: 10 de abril de 2026</p>

					<div className="space-y-6 text-neutral-700 leading-relaxed">
						<p>
							Esta aplicação é uma ferramenta interna usada pela Made in Bugs para
							fins de gestão de mídias sociais.
						</p>
						<p>
							Não coletamos, armazenamos ou compartilhamos dados pessoais de
							usuários terceiros. Este aplicativo acessa apenas nossas próprias contas.
						</p>
						<p>
							Contato:{' '}
							<a
								href="mailto:andress@madeinbugs.com.br"
								className="text-blue-600 hover:underline"
							>
								andress@madeinbugs.com.br
							</a>
						</p>
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
