import { normalizeLocale } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { verifyQuoteSignature, buildQuoteUrl } from '@/lib/services/quote-url';
import Link from 'next/link';
import type { Locale } from '@/lib/services/types';

export const dynamic = 'force-dynamic';

interface Props {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ id?: string }>;
}

export default async function QuoteSentPage({ params, searchParams }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale) as Locale;
	const { id } = await searchParams;

	let isValid = false;
	let quoteId = id || '';
	let shareableUrl = '';

	// Validate via mib_quote_session cookie
	if (id) {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get('mib_quote_session');

		if (sessionCookie?.value) {
			const [cookieUuid, cookieSig] = sessionCookie.value.split(':');
			if (cookieUuid === id && cookieSig && verifyQuoteSignature(cookieUuid, cookieSig)) {
				isValid = true;
				shareableUrl = buildQuoteUrl(locale, id);
			}
		}
	}

	return (
		<div className="flex items-center justify-center p-6 min-h-[60vh]">
			<div className="max-w-lg w-full bg-service-bg-elevated rounded-2xl border border-service-border overflow-hidden text-center">
				<img
					src="/assets/mail/MiB-Mail-Banner1.png"
					alt="Made in Bugs"
					className="w-full block"
				/>
				<div className="p-8">
					<h1 className="text-2xl font-bold text-service-text-primary mb-2">
						{locale === 'pt-BR' ? 'Orçamento enviado!' : 'Quote submitted!'}
					</h1>

					<p className="text-service-text-secondary mb-6 mt-4">
						{locale === 'pt-BR'
							? 'Recebemos seu pedido de orçamento. Nossa equipe vai analisar e responder em 2-3 dias úteis.'
							: "We've received your quote request. Our team will review and respond within 2-3 business days."}
					</p>

					{isValid && quoteId && (
						<>
							<div className="bg-service-accent/10 border border-service-accent/30 rounded-lg p-4 mb-4 text-left">
								<p className="text-sm font-semibold text-service-text-secondary mb-2">
									{locale === 'pt-BR' ? 'Link do seu orçamento:' : 'Your quote link:'}
								</p>
								<a
									href={shareableUrl}
									className="text-sm text-service-accent hover:underline break-all"
								>
									{shareableUrl}
								</a>
							</div>
							<p className="text-xs text-service-text-tertiary mb-6">
								{locale === 'pt-BR'
									? 'Salve este link — você pode usá-lo para ver seu orçamento a qualquer momento.'
									: 'Save this link — you can use it to view your quote at any time.'}
							</p>
						</>
					)}

					<p className="text-sm text-service-text-secondary mb-6">
						{locale === 'pt-BR'
							? 'Também enviamos um email com o link do seu orçamento. Se não receber em 5 minutos, verifique sua pasta de spam.'
							: "We've also emailed you a link to your quote. If you don't see it within 5 minutes, check your spam folder."}
					</p>

					<div className="flex flex-col gap-3">
						<Link
							href={`/${locale}/services`}
							className="inline-block px-6 py-3 bg-service-accent text-white font-semibold rounded-lg hover:bg-service-accent-hover transition-colors"
						>
							{locale === 'pt-BR' ? '← Voltar aos serviços' : '← Back to services'}
						</Link>
						<Link
							href={`/${locale}`}
							className="text-service-accent hover:underline text-sm"
						>
							{locale === 'pt-BR' ? 'Ir para a página inicial' : 'Go to homepage'}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
