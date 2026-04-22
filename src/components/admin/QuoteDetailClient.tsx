'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	FaExclamationTriangle,
	FaCheckCircle,
	FaExternalLinkAlt,
	FaGift,
} from 'react-icons/fa';
import type { SelectedItemSnapshot, Currency } from '@/lib/services/types';

export interface QuoteDetailRow {
	id: string;
	status: string;
	created_at: string;
	updated_at: string;
	expires_at: string;
	client_name: string;
	client_email: string;
	studio_name: string | null;
	studio_website: string | null;
	message: string | null;
	locale: string;
	currency: string;
	setup_price: number;
	maintenance_months: number;
	maintenance_monthly_price: number;
	maintenance_total: number;
	total_price: number;
	selected_items: SelectedItemSnapshot[];
	twenty_opportunity_id: string | null;
	response_notes: string | null;
	response_sent_at: string | null;
	ref_param: string | null;
	ip_hash: string | null;
	catalog_version: string | null;
	terms_version: string | null;
	url_signature: string;
}

interface Props {
	quote: QuoteDetailRow;
	shareableUrl: string;
}

const STATUSES = ['new', 'contacted', 'quoted', 'accepted', 'rejected', 'expired'] as const;

const STATUS_COLORS: Record<string, string> = {
	new: 'bg-blue-900/30 text-blue-400',
	contacted: 'bg-amber-900/30 text-amber-400',
	quoted: 'bg-teal-900/30 text-teal-400',
	accepted: 'bg-green-900/30 text-green-400',
	rejected: 'bg-neutral-800 text-neutral-400',
	expired: 'bg-red-900/30 text-red-400',
};

function formatPrice(amount: number, currency: string): string {
	if (currency === 'BRL') return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
	return `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric', month: 'long', day: 'numeric',
		hour: '2-digit', minute: '2-digit',
	});
}

function isSyncPending(quote: QuoteDetailRow): boolean {
	if (quote.twenty_opportunity_id) return false;
	return Date.now() - new Date(quote.created_at).getTime() > 60_000;
}

type AlertType = { type: 'success' | 'error'; text: string };

export default function QuoteDetailClient({ quote: initialQuote, shareableUrl }: Props) {
	const [quote, setQuote] = useState(initialQuote);
	const [status, setStatus] = useState(initialQuote.status);
	const [notes, setNotes] = useState(initialQuote.response_notes ?? '');
	const [saving, setSaving] = useState(false);
	const [sendingEmail, setSendingEmail] = useState(false);
	const [retryingSync, setRetryingSync] = useState(false);
	const [alert, setAlert] = useState<AlertType | null>(null);

	function showAlert(type: 'success' | 'error', text: string) {
		setAlert({ type, text });
		setTimeout(() => setAlert(null), 4000);
	}

	async function handleSave() {
		setSaving(true);
		try {
			const res = await fetch('/api/services/admin/update-quote', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quoteId: quote.id, status, notes }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? 'Failed to save');
			}
			setQuote(q => ({ ...q, status, response_notes: notes }));
			showAlert('success', 'Changes saved.');
		} catch (err) {
			showAlert('error', err instanceof Error ? err.message : 'Failed to save');
		} finally {
			setSaving(false);
		}
	}

	async function handleSendEmail() {
		setSendingEmail(true);
		try {
			const res = await fetch('/api/services/send-response-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quoteId: quote.id, notes }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'Failed to send email');
			setQuote(q => ({ ...q, response_notes: notes, response_sent_at: new Date().toISOString() }));
			showAlert('success', 'Response email sent!');
		} catch (err) {
			showAlert('error', err instanceof Error ? err.message : 'Failed to send email');
		} finally {
			setSendingEmail(false);
		}
	}

	async function handleRetrySync() {
		setRetryingSync(true);
		try {
			const res = await fetch('/api/services/retry-twenty-sync', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quoteId: quote.id }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error ?? 'Failed to trigger sync');
			showAlert('success', 'Sync retry triggered — check Discord for confirmation.');
		} catch (err) {
			showAlert('error', err instanceof Error ? err.message : 'Failed to trigger sync');
		} finally {
			setRetryingSync(false);
		}
	}

	const syncPending = isSyncPending(quote);
	const currency = quote.currency as Currency;
	const items = quote.selected_items as SelectedItemSnapshot[];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Top nav */}
			<div className="flex items-center gap-2 text-sm text-service-text-secondary">
				<Link href="/admin/quotes" className="hover:text-white transition-colors">
					← All quotes
				</Link>
				<span className="text-service-text-tertiary">/</span>
				<span className="text-service-text-tertiary font-mono text-xs">{quote.id.slice(0, 8)}…</span>
			</div>

			{/* Alert banner */}
			{alert && (
				<div className={`rounded-lg px-4 py-3 text-sm font-medium ${alert.type === 'success'
						? 'bg-green-900/30 border border-green-800/40 text-green-300'
						: 'bg-red-900/30 border border-red-800/40 text-red-300'
					}`}>
					{alert.type === 'success' ? '✓ ' : '✗ '}{alert.text}
				</div>
			)}

			{/* Header */}
			<div className="bg-service-bg-elevated border border-service-border rounded-xl p-6">
				<div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
					<div>
						<h1 className="text-xl font-bold text-white">
							{quote.studio_name ?? quote.client_name}
						</h1>
						<p className="text-service-text-secondary text-sm mt-1">
							{quote.client_name} · {quote.client_email}
						</p>
						{quote.studio_website && (
							<a
								href={quote.studio_website}
								target="_blank"
								rel="noopener noreferrer"
								className="text-service-accent hover:underline text-sm inline-flex items-center gap-1 mt-1"
							>
								{quote.studio_website} <FaExternalLinkAlt className="text-[10px]" />
							</a>
						)}
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						<span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[quote.status] ?? 'bg-neutral-800 text-neutral-400'}`}>
							{quote.status}
						</span>
						{syncPending && (
							<span title="Twenty sync pending" className="text-amber-400 text-lg">
								<FaExclamationTriangle />
							</span>
						)}
						{quote.response_sent_at && (
							<span title="Response email sent" className="text-green-400 text-lg">
								<FaCheckCircle />
							</span>
						)}
					</div>
				</div>

				{/* Links row */}
				<div className="mt-4 flex flex-wrap gap-3 text-xs">
					<a
						href={shareableUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-service-accent hover:underline"
					>
						Shareable quote <FaExternalLinkAlt className="text-[10px]" />
					</a>
					{quote.twenty_opportunity_id && (
						<a
							href={`${process.env.NEXT_PUBLIC_TWENTY_BASE_URL ?? 'https://crm.madeinbugs.com.br'}/opportunities/${quote.twenty_opportunity_id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 text-purple-400 hover:underline"
						>
							Twenty Opportunity <FaExternalLinkAlt className="text-[10px]" />
						</a>
					)}
				</div>

				{/* Meta row */}
				<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-service-text-tertiary">
					<span>Submitted: {formatDate(quote.created_at)}</span>
					<span>Locale: {quote.locale}</span>
					{quote.ref_param && <span>Ref: {quote.ref_param}</span>}
					{quote.catalog_version && <span>Catalog: {quote.catalog_version}</span>}
				</div>

				{quote.message && (
					<div className="mt-4 bg-service-bg border border-service-border rounded-lg p-4 text-sm text-service-text-secondary">
						<p className="text-xs text-service-text-tertiary mb-1 font-medium uppercase tracking-wide">Client message</p>
						<p className="whitespace-pre-wrap">{quote.message}</p>
					</div>
				)}
			</div>

			{/* Admin actions */}
			<div className="bg-service-bg-elevated border border-service-border rounded-xl p-6">
				<h2 className="text-sm font-semibold text-service-text-tertiary uppercase tracking-wide mb-4">Admin Actions</h2>

				<div className="grid sm:grid-cols-2 gap-4 mb-4">
					{/* Status dropdown */}
					<div>
						<label className="block text-xs text-service-text-tertiary mb-1.5 font-medium">Status</label>
						<select
							value={status}
							onChange={e => setStatus(e.target.value)}
							className="w-full bg-service-bg border border-service-border rounded-lg px-3 py-2 text-sm text-service-text-primary focus:outline-none focus:border-service-accent appearance-none"
						>
							{STATUSES.map(s => (
								<option key={s} value={s} className="bg-[#060a10] capitalize">{s}</option>
							))}
						</select>
					</div>

					{/* Response info */}
					<div className="flex flex-col justify-end">
						{quote.response_sent_at ? (
							<p className="text-xs text-service-text-secondary">
								<span className="text-green-400">✓</span> Response sent {formatDate(quote.response_sent_at)}
							</p>
						) : (
							<p className="text-xs text-service-text-tertiary">No response email sent yet.</p>
						)}
						{quote.twenty_opportunity_id ? (
							<p className="text-xs text-service-text-secondary mt-1">
								<span className="text-teal-400">✓</span> Synced to Twenty
							</p>
						) : syncPending ? (
							<p className="text-xs text-amber-400 mt-1">
								<FaExclamationTriangle className="inline mr-1" />
								Twenty sync pending
							</p>
						) : null}
					</div>
				</div>

				{/* Notes textarea */}
				<div className="mb-4">
					<label className="block text-xs text-service-text-tertiary mb-1.5 font-medium">
						Response notes (sent to client as email body)
					</label>
					<textarea
						value={notes}
						onChange={e => setNotes(e.target.value)}
						rows={8}
						placeholder="Write your response to the client here. Supports Markdown."
						className="w-full bg-service-bg border border-service-border rounded-lg px-3 py-2 text-sm text-service-text-primary placeholder:text-service-text-tertiary focus:outline-none focus:border-service-accent resize-y font-mono"
					/>
				</div>

				{/* Action buttons */}
				<div className="flex flex-wrap gap-3">
					<button
						onClick={handleSave}
						disabled={saving}
						className="px-4 py-2 bg-service-accent hover:bg-service-accent-hover text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? 'Saving…' : 'Save changes'}
					</button>

					<button
						onClick={handleSendEmail}
						disabled={sendingEmail || !notes.trim()}
						className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title={!notes.trim() ? 'Add notes before sending' : ''}
					>
						{sendingEmail ? 'Sending…' : quote.response_sent_at ? 'Resend response email' : 'Send response email'}
					</button>

					<button
						onClick={handleRetrySync}
						disabled={retryingSync}
						className="px-4 py-2 bg-service-bg border border-service-border hover:border-amber-500 text-amber-400 hover:text-amber-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{retryingSync ? 'Retrying…' : 'Retry Twenty sync'}
					</button>
				</div>
			</div>

			{/* Quote items */}
			<div className="bg-service-bg-elevated border border-service-border rounded-xl p-6">
				<h2 className="text-sm font-semibold text-service-text-tertiary uppercase tracking-wide mb-4">
					Selected Services ({items.length})
				</h2>
				<div className="space-y-3">
					{items.map(item => (
						<div key={item.serviceId} className="border border-service-border rounded-lg p-4">
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-2 min-w-0">
									<span className="font-semibold text-service-text-primary truncate">
										{item.serviceName.en}
									</span>
									{item.bundledFree && (
										<span className="inline-flex items-center gap-1 text-xs text-teal-400 bg-teal-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
											<FaGift className="text-[10px]" /> bundled free
										</span>
									)}
								</div>
								<span className="text-service-text-primary font-semibold text-sm flex-shrink-0">
									{formatPrice(item.basePrice[currency], currency)}
								</span>
							</div>

							{item.configurations.length > 0 && (
								<div className="mt-2 space-y-1">
									{item.configurations.map(config => (
										<div key={config.configurationId} className="text-xs text-service-text-secondary">
											<span className="text-service-text-tertiary">{config.configurationLabel.en}:</span>{' '}
											{config.selectedOptions.map(opt => (
												<span key={opt.optionId}>
													{opt.optionLabel.en}
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
									{item.customFields.map(cf => (
										<div key={cf.customFieldId} className="text-xs">
											<span className="text-service-text-tertiary">{cf.customFieldLabel.en}:</span>
											{cf.pendingPricing && (
												<span className="ml-1 bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
													pending pricing
												</span>
											)}
											{cf.values.map((v, i) => (
												<p key={i} className="text-service-text-secondary ml-4 mt-0.5">{v}</p>
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
			<div className="bg-service-bg-elevated border border-service-border rounded-xl p-6">
				<h2 className="text-sm font-semibold text-service-text-tertiary uppercase tracking-wide mb-4">Pricing</h2>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between text-service-text-secondary">
						<span>Setup</span>
						<span>{formatPrice(Number(quote.setup_price), currency)}</span>
					</div>
					{quote.maintenance_months > 0 && (
						<>
							<div className="flex justify-between text-service-text-secondary">
								<span>Maintenance ({quote.maintenance_months} months)</span>
								<span>{formatPrice(Number(quote.maintenance_total), currency)}</span>
							</div>
							<div className="flex justify-between text-service-text-tertiary text-xs">
								<span>Monthly</span>
								<span>{formatPrice(Number(quote.maintenance_monthly_price), currency)}/mo</span>
							</div>
						</>
					)}
					<div className="border-t border-service-border pt-2 flex justify-between text-white font-bold">
						<span>Total</span>
						<span>{formatPrice(Number(quote.total_price), currency)}</span>
					</div>
				</div>
			</div>

			{/* Metadata */}
			<div className="bg-service-bg-elevated border border-service-border rounded-xl p-6">
				<h2 className="text-sm font-semibold text-service-text-tertiary uppercase tracking-wide mb-4">Metadata</h2>
				<div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
					{[
						['ID', quote.id],
						['Locale', quote.locale],
						['Currency', quote.currency],
						['IP hash', quote.ip_hash ?? '—'],
						['Catalog version', quote.catalog_version ?? '—'],
						['Terms version', quote.terms_version ?? '—'],
						['Ref param', quote.ref_param ?? '—'],
						['Expires at', formatDate(quote.expires_at)],
						['Updated at', formatDate(quote.updated_at)],
					].map(([label, value]) => (
						<div key={label} className="flex gap-2">
							<span className="text-service-text-tertiary w-32 flex-shrink-0">{label}</span>
							<span className="text-service-text-secondary break-all">{value}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
