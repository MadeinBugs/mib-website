import { normalizeLocale } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { verifyQuoteSignature } from '@/lib/services/quote-url';
import Link from 'next/link';

interface Props {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ id?: string }>;
}

export default async function QuoteSentPage({ params, searchParams }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const { id } = await searchParams;

	let isValid = false;
	let quoteId = id || '';

	// Validate via mib_quote_session cookie
	if (id) {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get('mib_quote_session');

		if (sessionCookie?.value) {
			const [cookieUuid, cookieSig] = sessionCookie.value.split(':');
			if (cookieUuid === id && cookieSig && verifyQuoteSignature(cookieUuid, cookieSig)) {
				isValid = true;
			}

			// Clear the cookie after reading
			cookieStore.set('mib_quote_session', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				maxAge: 0,
			});
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
			<div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
				<div className="text-5xl mb-4">✅</div>

				<h1 className="text-2xl font-bold text-neutral-800 mb-4">
					{locale === 'pt-BR' ? 'Orçamento enviado!' : 'Quote submitted!'}
				</h1>

				<p className="text-neutral-600 mb-6">
					{locale === 'pt-BR'
						? 'Recebemos seu pedido de orçamento. Nossa equipe vai analisar e responder em 2-3 dias úteis.'
						: "We've received your quote request. Our team will review and respond within 2-3 business days."}
				</p>

				{isValid && quoteId && (
					<div className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-4 mb-6 text-left">
						<p className="text-sm text-neutral-500 mb-1">
							{locale === 'pt-BR' ? 'ID do orçamento:' : 'Quote ID:'}
						</p>
						<code className="text-sm font-mono text-neutral-800 break-all">{quoteId}</code>
					</div>
				)}

				<p className="text-sm text-neutral-500 mb-6">
					{locale === 'pt-BR'
						? `Também enviamos um email com o link do seu orçamento. Se não receber em 5 minutos, verifique sua pasta de spam.`
						: `We've also emailed you a link to your quote. If you don't see it within 5 minutes, check your spam folder.`}
				</p>

				<div className="flex flex-col gap-3">
					<Link
						href={`/${locale}/services`}
						className="inline-block px-6 py-3 bg-[#04c597] text-white font-semibold rounded-lg hover:bg-[#036b54] transition-colors"
					>
						{locale === 'pt-BR' ? '← Voltar aos serviços' : '← Back to services'}
					</Link>
					<Link
						href={`/${locale}`}
						className="text-[#04c597] hover:underline text-sm"
					>
						{locale === 'pt-BR' ? 'Ir para a página inicial' : 'Go to homepage'}
					</Link>
				</div>
			</div>
		</div>
	);
}
