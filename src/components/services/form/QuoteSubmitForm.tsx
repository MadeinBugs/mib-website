'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, ServiceItem } from '../../../lib/services/types';
import type { BuilderState, BuilderAction } from '../../../lib/services/builder-types';
import { computeGrandTotal } from '../../../lib/services/pricing';
import { CATALOG_VERSION } from '../../../lib/services/catalog-version.generated';
import { TERMS_VERSION } from '../../../lib/services/defaults';
import ConsentCheckbox from './ConsentCheckbox';
import HoneypotField from './HoneypotField';

interface QuoteSubmitFormProps {
	locale: Locale;
	catalog: ServiceItem[];
	state: BuilderState;
	dispatch: React.Dispatch<BuilderAction>;
	onClose: () => void;
}

const ERROR_MESSAGES: Record<string, Record<Locale, string>> = {
	PRICE_DRIFT_TOO_LARGE: {
		en: 'Our pricing has been updated since you started. Please refresh and review your package.',
		'pt-BR': 'Nossos preços foram atualizados desde que você começou. Atualize e revise seu pacote.',
	},
	CATALOG_VERSION_MISMATCH: {
		en: 'Our catalog has been updated. Please refresh the page and review your selections.',
		'pt-BR': 'Nosso catálogo foi atualizado. Atualize a página e revise suas seleções.',
	},
	TERMS_VERSION_MISMATCH: {
		en: 'Our terms have been updated. Please refresh the page and review your consent.',
		'pt-BR': 'Nossos termos foram atualizados. Atualize a página e revise seu consentimento.',
	},
	BUNDLE_INVALID: {
		en: 'Bundle conditions are no longer met. Please review your selections.',
		'pt-BR': 'As condições do bundle não são mais atendidas. Revise suas seleções.',
	},
	RATE_LIMITED: {
		en: 'Too many requests. Please wait a minute and try again.',
		'pt-BR': 'Muitas tentativas. Aguarde um minuto e tente novamente.',
	},
	GENERIC: {
		en: 'Something went wrong. Please try again.',
		'pt-BR': 'Algo deu errado. Tente novamente.',
	},
};

function getErrorMessage(code: string | undefined, status: number, locale: Locale): string {
	if (status === 429) return ERROR_MESSAGES.RATE_LIMITED[locale];
	if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code][locale];
	return ERROR_MESSAGES.GENERIC[locale];
}

export default function QuoteSubmitForm({ locale, catalog, state, dispatch, onClose }: QuoteSubmitFormProps) {
	const router = useRouter();
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Honeypot check — DOM field is "company_url_confirm"
		const honeypotEl = document.getElementById('company_url_confirm') as HTMLInputElement | null;
		if (honeypotEl?.value) return;

		const errors: string[] = [];
		if (!state.clientInfo.name.trim()) {
			errors.push(locale === 'en' ? 'Name is required' : 'Nome é obrigatório');
		}
		if (!state.clientInfo.email.trim()) {
			errors.push(locale === 'en' ? 'Email is required' : 'Email é obrigatório');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.clientInfo.email)) {
			errors.push(locale === 'en' ? 'Invalid email address' : 'Email inválido');
		}
		if (!state.consentAccepted) {
			errors.push(locale === 'en' ? 'You must accept the terms' : 'Você deve aceitar os termos');
		}

		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}

		setValidationErrors([]);
		dispatch({ type: 'SUBMIT_START' });

		// Compute client-side total for drift detection
		const selectedItems = Object.values(state.selectedItems);
		const totals = computeGrandTotal(
			catalog,
			selectedItems,
			state.currency,
			state.maintenanceMonths,
			state.bundleAdded
		);

		const payload = {
			locale: state.locale,
			currency: state.currency,
			selectedItems,
			maintenanceMonths: state.maintenanceMonths,
			clientInfo: {
				name: state.clientInfo.name.trim(),
				email: state.clientInfo.email.trim(),
				...(state.clientInfo.studioName.trim() ? { studioName: state.clientInfo.studioName.trim() } : {}),
				...(state.clientInfo.studioWebsite.trim() ? { studioWebsite: state.clientInfo.studioWebsite.trim() } : {}),
				...(state.clientInfo.message.trim() ? { message: state.clientInfo.message.trim() } : {}),
			},
			consentAccepted: true as const,
			termsVersion: TERMS_VERSION,
			catalogVersion: CATALOG_VERSION,
			honeypot: '',
			...(state.refParam ? { refParam: state.refParam } : {}),
			clientComputedTotal: totals.grandTotal,
			...(state.bundleAdded.length > 0 ? { bundleAdded: state.bundleAdded } : {}),
		};

		try {
			window.umami?.track('quote_submission_started', { itemCount: selectedItems.length, currency: state.currency });

			const res = await fetch('/api/services/quote-request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				const errorMsg = getErrorMessage(data.code, res.status, locale);
				window.umami?.track('quote_submission_error', { code: data.code || 'unknown', status: res.status });
				dispatch({ type: 'SUBMIT_ERROR', error: errorMsg });
				return;
			}

			const data = await res.json();
			window.umami?.track('quote_submitted', { itemCount: selectedItems.length, total: totals.grandTotal, currency: state.currency });
			dispatch({ type: 'SUBMIT_SUCCESS', quoteId: data.id });

			// Navigate to the quote-sent page
			router.push(`/${locale}/services/quote-sent?id=${data.id}`);
		} catch {
			dispatch({
				type: 'SUBMIT_ERROR',
				error: ERROR_MESSAGES.GENERIC[locale],
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h3 className="text-lg font-bold text-service-text-primary">
				{locale === 'en' ? 'Contact Information' : 'Informações de Contato'}
			</h3>

			<HoneypotField />

			<div className="space-y-3">
				<div>
					<label className="block text-sm font-medium text-service-text-secondary mb-1">
						{locale === 'en' ? 'Name' : 'Nome'} <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={state.clientInfo.name}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'name', value: e.target.value })}
						className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none"
						maxLength={200}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-service-text-secondary mb-1">
						{locale === 'en' ? 'Email' : 'Email'} <span className="text-red-500">*</span>
					</label>
					<input
						type="email"
						value={state.clientInfo.email}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'email', value: e.target.value })}
						className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none"
						maxLength={254}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-service-text-secondary mb-1">
						{locale === 'en' ? 'Studio/Company (optional)' : 'Estúdio/Empresa (opcional)'}
					</label>
					<input
						type="text"
						value={state.clientInfo.studioName}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'studioName', value: e.target.value })}
						className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none"
						maxLength={200}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-service-text-secondary mb-1">
						{locale === 'en' ? 'Website (optional)' : 'Website (opcional)'}
					</label>
					<div className="flex">
						<span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-service-border bg-service-bg-strong text-service-text-tertiary text-sm select-none">
							https://
						</span>
						<input
							type="text"
							value={state.clientInfo.studioWebsite.replace(/^https?:\/\//, '')}
							onChange={(e) => {
								const raw = e.target.value.replace(/^https?:\/\//, '');
								dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'studioWebsite', value: raw ? `https://${raw}` : '' });
							}}
							placeholder={locale === 'en' ? 'yoursite.com' : 'seusite.com.br'}
							className="flex-1 min-w-0 rounded-r-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none"
							maxLength={300}
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-service-text-secondary mb-1">
						{locale === 'en' ? 'Message (optional)' : 'Mensagem (opcional)'}
					</label>
					<textarea
						value={state.clientInfo.message}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'message', value: e.target.value })}
						rows={3}
						className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none resize-y"
						maxLength={2000}
					/>
				</div>
			</div>

			<ConsentCheckbox
				locale={locale}
				accepted={state.consentAccepted}
				onChange={(accepted) => dispatch({ type: 'SET_CONSENT', accepted })}
			/>

			{validationErrors.length > 0 && (
				<div className="rounded-lg bg-red-900/20 border border-red-800/30 px-3 py-2 space-y-1">
					{validationErrors.map((err, i) => (
						<p key={i} className="text-xs text-red-400">{err}</p>
					))}
				</div>
			)}

			{state.submissionError && (
				<div className="rounded-lg bg-red-900/20 border border-red-800/30 px-3 py-2">
					<p className="text-xs text-red-400">{state.submissionError}</p>
				</div>
			)}

			<div className="flex gap-3">
				<button
					type="button"
					onClick={onClose}
					className="flex-1 py-2.5 rounded-lg border border-service-border text-service-text-secondary font-medium hover:bg-service-bg-strong transition-colors text-sm"
				>
					{locale === 'en' ? 'Cancel' : 'Cancelar'}
				</button>
				<button
					type="submit"
					disabled={state.submissionState === 'submitting' || !state.consentAccepted}
					className="flex-1 py-2.5 rounded-lg bg-service-accent text-white font-semibold hover:bg-service-accent-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{state.submissionState === 'submitting'
						? (locale === 'en' ? 'Sending…' : 'Enviando…')
						: (locale === 'en' ? 'Send Quote Request' : 'Enviar Solicitação')}
				</button>
			</div>
		</form>
	);
}
