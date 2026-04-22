import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyQuoteSignature } from '@/lib/services/quote-url';
import { autoExpireQuote } from '@/lib/services/quote-expiration';
import { formatPrice, formatDate } from '@/lib/services/format';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { FaGift } from 'react-icons/fa';
import type { SelectedItemSnapshot, Locale, Currency } from '@/lib/services/types';

export const dynamic = 'force-dynamic';

interface Props {
	params: Promise<{ locale: string; uuid: string }>;
	searchParams: Promise<{ sig?: string }>;
}

function StatusBadge({ status }: { status: string }) {
	const colors: Record<string, string> = {
		new: 'bg-blue-900/30 text-blue-400',
		contacted: 'bg-amber-900/30 text-amber-400',
		quoted: 'bg-teal-900/30 text-teal-400',
		accepted: 'bg-green-900/30 text-green-400',
		rejected: 'bg-neutral-800 text-neutral-400',
		expired: 'bg-red-900/30 text-red-400',
	};
	return (
		<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors[status] || 'bg-neutral-800 text-neutral-400'}`}>
			{status}
		</span>
	);
}

export default async function QuoteViewPage({ params, searchParams }: Props) {
	const { locale: rawLocale, uuid } = await params;
	const locale = normalizeLocale(rawLocale) as Locale;
	const { sig } = await searchParams;

	// Verify signature before DB fetch to avoid timing side-channel
	if (!sig || !verifyQuoteSignature(uuid, sig)) notFound();

	// Fetch quote
	const supabase = createServiceClient();
	const { data: quote, error: dbError } = await supabase
		.from('quote_requests')
		.select('*')
		.eq('id', uuid)
		.single();

	if (dbError || !quote) notFound();

	// Verify stored signature matches
	if (quote.url_signature !== sig) notFound();

	// Auto-expire
	const status = await autoExpireQuote(uuid, quote.status, quote.expires_at);

	const items = quote.selected_items as SelectedItemSnapshot[];
	const currency = quote.currency as Currency;
	const isExpired = status === 'expired';

	return (
		<div className="p-6">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="bg-service-bg-elevated rounded-2xl border border-service-border p-8 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold text-service-text-primary">
							{locale === 'pt-BR' ? 'Orçamento para' : 'Quote for'}{' '}
							{quote.studio_name || quote.client_name}
						</h1>
						<StatusBadge status={status} />
					</div>

					{isExpired && (
						<div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-4">
							<p className="text-red-400 font-semibold">
								{locale === 'pt-BR' ? 'Este orçamento expirou.' : 'This quote has expired.'}
							</p>
							<Link
								href={`/${locale}/services/infra-builder`}
								className="text-service-accent hover:underline text-sm mt-1 inline-block"
							>
								{locale === 'pt-BR' ? 'Montar um novo pacote →' : 'Build a new package →'}
							</Link>
						</div>
					)}

					{status === 'new' && (
						<div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 mb-4">
							<p className="text-blue-400 text-sm">
								{locale === 'pt-BR'
									? `Válido até ${formatDate(new Date(quote.expires_at), locale)}`
									: `Valid until ${formatDate(new Date(quote.expires_at), locale)}`}
							</p>
						</div>
					)}

					<p className="text-sm text-service-text-secondary">
						{locale === 'pt-BR' ? 'Enviado em' : 'Submitted on'}{' '}
						{formatDate(new Date(quote.created_at), locale)}
					</p>
				</div>

				{/* Selected Services */}
				<div className="bg-service-bg-elevated rounded-2xl border border-service-border p-8 mb-6">
					<h2 className="text-lg font-bold text-service-text-primary mb-4">
						{locale === 'pt-BR' ? 'Serviços selecionados' : 'Selected services'}
					</h2>
					<div className="space-y-4">
						{items.map((item) => (
							<div key={item.serviceId} className="border border-service-border rounded-lg p-4">
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-service-text-primary">
											{item.serviceName[locale]}
										</h3>
										{item.bundledFree && (
											<span className="inline-flex items-center gap-1 text-xs text-teal-400 bg-teal-900/30 px-2 py-0.5 rounded-full">
												<FaGift className="text-[10px]" />
												{locale === 'pt-BR' ? 'incluído grátis' : 'bundled free'}
											</span>
										)}
									</div>
									<span className="text-service-text-primary font-semibold">
										{formatPrice(item.basePrice[currency], currency)}
									</span>
								</div>

								{item.configurations.length > 0 && (
									<div className="mt-2 space-y-1">
										{item.configurations.map((config) => (
											<div key={config.configurationId} className="text-sm text-service-text-secondary">
												<span className="text-service-text-tertiary">{config.configurationLabel[locale]}:</span>{' '}
												{config.selectedOptions.map((opt) => (
													<span key={opt.optionId}>
														{opt.optionLabel[locale]}
														{opt.priceModifier[currency] > 0 && (
															<span className="text-service-text-tertiary ml-1">
																(+{formatPrice(opt.priceModifier[currency], currency)})
															</span>
														)}
													</span>
												))}
											</div>
										))}
									</div>
								)}

								{item.customFields.length > 0 && (
									<div className="mt-2 space-y-1">
										{item.customFields.map((cf) => (
											<div key={cf.customFieldId} className="text-sm">
												<span className="text-service-text-tertiary">{cf.customFieldLabel[locale]}:</span>
												{cf.pendingPricing && (
													<span className="ml-1 text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded">
														⏱ {locale === 'pt-BR' ? 'Orçado após análise' : 'Quoted after review'}
													</span>
												)}
												{cf.values.map((v, i) => (
													<p key={i} className="text-service-text-secondary ml-4 mt-1">{v}</p>
												))}
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Totals */}
				<div className="bg-service-bg-elevated rounded-2xl border border-service-border p-8 mb-6">
					<h2 className="text-lg font-bold text-service-text-primary mb-4">
						{locale === 'pt-BR' ? 'Resumo' : 'Summary'}
					</h2>
					<div className="space-y-2">
						<div className="flex justify-between text-service-text-secondary">
							<span>{locale === 'pt-BR' ? 'Setup' : 'Setup'}</span>
							<span>{formatPrice(Number(quote.setup_price), currency)}</span>
						</div>
						{quote.maintenance_months > 0 && (
							<>
								<div className="flex justify-between text-service-text-secondary">
									<span>
										{locale === 'pt-BR' ? 'Manutenção' : 'Maintenance'} ({quote.maintenance_months}{locale === 'pt-BR' ? ' meses' : ' months'})
									</span>
									<span>{formatPrice(Number(quote.maintenance_total), currency)}</span>
								</div>
								<div className="flex justify-between text-service-text-tertiary text-sm">
									<span>{locale === 'pt-BR' ? 'Mensal' : 'Monthly'}</span>
									<span>{formatPrice(Number(quote.maintenance_monthly_price), currency)}/{locale === 'pt-BR' ? 'mês' : 'mo'}</span>
								</div>
							</>
						)}
						<div className="border-t border-service-border-strong pt-2 flex justify-between text-service-text-primary font-bold text-lg">
							<span>Total</span>
							<span>{formatPrice(Number(quote.total_price), currency)}</span>
						</div>
						{quote.has_pending_items && (
							<div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3 mt-3">
								<p className="text-amber-400 text-sm">
									⏱ {locale === 'pt-BR'
										? `${quote.pending_item_count} item(ns) precisam de análise antes do preço final.`
										: `${quote.pending_item_count} item(s) need review before final pricing.`}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Response section */}
				{quote.response_sent_at && quote.response_notes && (
					<div className="bg-service-bg-elevated rounded-2xl border border-service-border p-8 mb-6">
						<h2 className="text-lg font-bold text-service-text-primary mb-4">
							{locale === 'pt-BR' ? 'Nossa resposta' : 'Our response'}
						</h2>
						<div className="prose prose-invert max-w-none text-service-text-secondary text-sm">
							<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
								{quote.response_notes}
							</ReactMarkdown>
						</div>
						<p className="text-xs text-service-text-tertiary mt-4">
							{locale === 'pt-BR' ? 'Respondido em' : 'Responded on'}{' '}
							{formatDate(new Date(quote.response_sent_at), locale)}
						</p>
					</div>
				)}

				{/* Footer */}
				<div className="text-center text-sm text-service-text-tertiary mt-8">
					<p>
						{locale === 'pt-BR' ? 'Dúvidas?' : 'Questions?'}{' '}
						<a href="mailto:hello@madeinbugs.com.br" className="text-service-accent hover:underline">
							hello@madeinbugs.com.br
						</a>
					</p>
					<p className="mt-1">Quote ID: {uuid}</p>
					<p className="mt-1 text-xs">
						{locale === 'pt-BR' ? 'Versão do catálogo' : 'Catalog version'}: {quote.catalog_version}
					</p>
				</div>
			</div>
		</div>
	);
}
