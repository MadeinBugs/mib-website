import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/i18n';
import { createServiceClient } from '@/lib/supabase/service';
import { verifyQuoteSignature } from '@/lib/services/quote-url';
import Link from 'next/link';
import type { SelectedItemSnapshot } from '@/lib/services/types';

interface Props {
	params: Promise<{ locale: string; uuid: string }>;
	searchParams: Promise<{ sig?: string }>;
}

function formatPrice(amount: number, currency: string): string {
	if (currency === 'BRL') return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
	return `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: string }) {
	const colors: Record<string, string> = {
		new: 'bg-blue-100 text-blue-800',
		contacted: 'bg-amber-100 text-amber-800',
		quoted: 'bg-teal-100 text-teal-800',
		accepted: 'bg-green-100 text-green-800',
		rejected: 'bg-gray-100 text-gray-800',
		expired: 'bg-red-100 text-red-800',
	};
	return (
		<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
			{status}
		</span>
	);
}

export default async function QuoteViewPage({ params, searchParams }: Props) {
	const { locale: rawLocale, uuid } = await params;
	const locale = normalizeLocale(rawLocale);
	const { sig } = await searchParams;

	if (!sig) notFound();

	// Validate signature
	if (!verifyQuoteSignature(uuid, sig)) notFound();

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
	let status = quote.status;
	if (status === 'new' && new Date(quote.expires_at) < new Date()) {
		await supabase
			.from('quote_requests')
			.update({ status: 'expired' })
			.eq('id', uuid);
		status = 'expired';
	}

	const items = quote.selected_items as SelectedItemSnapshot[];
	const currency = quote.currency;
	const isExpired = status === 'expired';

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold text-neutral-800">
							{locale === 'pt-BR' ? 'Orçamento para' : 'Quote for'}{' '}
							{quote.studio_name || quote.client_name}
						</h1>
						<StatusBadge status={status} />
					</div>

					{isExpired && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
							<p className="text-red-800 font-semibold">
								{locale === 'pt-BR' ? 'Este orçamento expirou.' : 'This quote has expired.'}
							</p>
							<Link
								href={`/${locale}/services/infra-builder`}
								className="text-[#04c597] hover:underline text-sm mt-1 inline-block"
							>
								{locale === 'pt-BR' ? 'Montar um novo pacote →' : 'Build a new package →'}
							</Link>
						</div>
					)}

					{status === 'new' && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
							<p className="text-blue-800 text-sm">
								{locale === 'pt-BR'
									? `Válido até ${new Date(quote.expires_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}`
									: `Valid until ${new Date(quote.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
							</p>
						</div>
					)}

					<p className="text-sm text-neutral-500">
						{locale === 'pt-BR' ? 'Enviado em' : 'Submitted on'}{' '}
						{new Date(quote.created_at).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
							year: 'numeric', month: 'long', day: 'numeric',
						})}
					</p>
				</div>

				{/* Selected Services */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<h2 className="text-lg font-bold text-neutral-800 mb-4">
						{locale === 'pt-BR' ? 'Serviços selecionados' : 'Selected services'}
					</h2>
					<div className="space-y-4">
						{items.map((item) => (
							<div key={item.serviceId} className="border border-neutral-200 rounded-lg p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold text-neutral-800">
											{item.serviceName[locale]}
										</h3>
										<p className="text-xs text-neutral-400 uppercase">{item.serviceCategory}</p>
									</div>
									<span className="text-neutral-800 font-semibold">
										{formatPrice(item.basePrice[currency as 'BRL' | 'USD'], currency)}
									</span>
								</div>

								{item.configurations.length > 0 && (
									<div className="mt-2 space-y-1">
										{item.configurations.map((config) => (
											<div key={config.configurationId} className="text-sm text-neutral-600">
												<span className="text-neutral-500">{config.configurationLabel[locale]}:</span>{' '}
												{config.selectedOptions.map((opt) => (
													<span key={opt.optionId}>
														{opt.optionLabel[locale]}
														{opt.priceModifier[currency as 'BRL' | 'USD'] > 0 && (
															<span className="text-neutral-400 ml-1">
																(+{formatPrice(opt.priceModifier[currency as 'BRL' | 'USD'], currency)})
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
												<span className="text-neutral-500">{cf.customFieldLabel[locale]}:</span>
												{cf.pendingPricing && (
													<span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
														⏱ {locale === 'pt-BR' ? 'Orçado após análise' : 'Quoted after review'}
													</span>
												)}
												{cf.values.map((v, i) => (
													<p key={i} className="text-neutral-600 ml-4 mt-1">{v}</p>
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
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<h2 className="text-lg font-bold text-neutral-800 mb-4">
						{locale === 'pt-BR' ? 'Resumo' : 'Summary'}
					</h2>
					<div className="space-y-2">
						<div className="flex justify-between text-neutral-600">
							<span>{locale === 'pt-BR' ? 'Setup' : 'Setup'}</span>
							<span>{formatPrice(Number(quote.setup_price), currency)}</span>
						</div>
						{quote.maintenance_months > 0 && (
							<>
								<div className="flex justify-between text-neutral-600">
									<span>
										{locale === 'pt-BR' ? 'Manutenção' : 'Maintenance'} ({quote.maintenance_months}{locale === 'pt-BR' ? ' meses' : ' months'})
									</span>
									<span>{formatPrice(Number(quote.maintenance_total), currency)}</span>
								</div>
								<div className="flex justify-between text-neutral-400 text-sm">
									<span>{locale === 'pt-BR' ? 'Mensal' : 'Monthly'}</span>
									<span>{formatPrice(Number(quote.maintenance_monthly_price), currency)}/{locale === 'pt-BR' ? 'mês' : 'mo'}</span>
								</div>
							</>
						)}
						<div className="border-t border-neutral-200 pt-2 flex justify-between text-neutral-800 font-bold text-lg">
							<span>Total</span>
							<span>{formatPrice(Number(quote.total_price), currency)}</span>
						</div>
						{quote.has_pending_items && (
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
								<p className="text-amber-800 text-sm">
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
					<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
						<h2 className="text-lg font-bold text-neutral-800 mb-4">
							{locale === 'pt-BR' ? 'Nossa resposta' : 'Our response'}
						</h2>
						<div className="prose prose-neutral max-w-none text-neutral-600 text-sm whitespace-pre-wrap">
							{quote.response_notes}
						</div>
						<p className="text-xs text-neutral-400 mt-4">
							{locale === 'pt-BR' ? 'Respondido em' : 'Responded on'}{' '}
							{new Date(quote.response_sent_at).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
								year: 'numeric', month: 'long', day: 'numeric',
							})}
						</p>
					</div>
				)}

				{/* Footer */}
				<div className="text-center text-sm text-neutral-400 mt-8">
					<p>
						{locale === 'pt-BR' ? 'Dúvidas?' : 'Questions?'}{' '}
						<a href="mailto:hello@madeinbugs.com.br" className="text-[#04c597] hover:underline">
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
