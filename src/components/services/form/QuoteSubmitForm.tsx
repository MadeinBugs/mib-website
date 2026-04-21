'use client';

import { useState, useRef } from 'react';
import type { Locale } from '../../../lib/services/types';
import type { BuilderState, BuilderAction } from '../../../lib/services/builder-types';
import ConsentCheckbox from './ConsentCheckbox';
import HoneypotField from './HoneypotField';

interface QuoteSubmitFormProps {
	locale: Locale;
	state: BuilderState;
	dispatch: React.Dispatch<BuilderAction>;
	onClose: () => void;
}

export default function QuoteSubmitForm({ locale, state, dispatch, onClose }: QuoteSubmitFormProps) {
	const honeypotRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Honeypot check
		const honeypotEl = document.getElementById('website_url') as HTMLInputElement | null;
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

		// Phase 4: Mock submission — logs to console
		console.log('[InfraBuilder] Mock quote submission:', {
			selectedItems: state.selectedItems,
			maintenanceMonths: state.maintenanceMonths,
			currency: state.currency,
			clientInfo: state.clientInfo,
			locale: state.locale,
			refParam: state.refParam,
		});

		// Simulate success after brief delay
		setTimeout(() => {
			dispatch({ type: 'SUBMIT_SUCCESS', quoteId: 'mock-' + Date.now() });
		}, 800);
	};

	if (state.submissionState === 'success') {
		return (
			<div className="text-center py-8 space-y-4">
				<div className="text-4xl">✅</div>
				<h3 className="text-lg font-bold text-neutral-800">
					{locale === 'en' ? 'Quote Request Sent!' : 'Solicitação Enviada!'}
				</h3>
				<p className="text-sm text-neutral-600">
					{locale === 'en'
						? "We'll get back to you within 2 business days."
						: 'Retornaremos em até 2 dias úteis.'}
				</p>
				<button
					type="button"
					onClick={onClose}
					className="btn-crayon bg-[#04c597] hover:bg-[#036b54] text-white px-6 py-2 rounded-lg font-medium transition-colors"
				>
					{locale === 'en' ? 'Close' : 'Fechar'}
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h3 className="text-lg font-bold text-neutral-800">
				{locale === 'en' ? 'Contact Information' : 'Informações de Contato'}
			</h3>

			<HoneypotField />

			<div className="space-y-3">
				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						{locale === 'en' ? 'Name' : 'Nome'} <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={state.clientInfo.name}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'name', value: e.target.value })}
						className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none"
						maxLength={200}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						{locale === 'en' ? 'Email' : 'Email'} <span className="text-red-500">*</span>
					</label>
					<input
						type="email"
						value={state.clientInfo.email}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'email', value: e.target.value })}
						className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none"
						maxLength={254}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						{locale === 'en' ? 'Studio/Company (optional)' : 'Estúdio/Empresa (opcional)'}
					</label>
					<input
						type="text"
						value={state.clientInfo.studioName}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'studioName', value: e.target.value })}
						className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none"
						maxLength={200}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						{locale === 'en' ? 'Website (optional)' : 'Website (opcional)'}
					</label>
					<input
						type="url"
						value={state.clientInfo.studioWebsite}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'studioWebsite', value: e.target.value })}
						className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none"
						maxLength={300}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-1">
						{locale === 'en' ? 'Message (optional)' : 'Mensagem (opcional)'}
					</label>
					<textarea
						value={state.clientInfo.message}
						onChange={(e) => dispatch({ type: 'UPDATE_CLIENT_INFO', field: 'message', value: e.target.value })}
						rows={3}
						className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none resize-y"
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
				<div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 space-y-1">
					{validationErrors.map((err, i) => (
						<p key={i} className="text-xs text-red-700">{err}</p>
					))}
				</div>
			)}

			{state.submissionError && (
				<div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
					<p className="text-xs text-red-700">{state.submissionError}</p>
				</div>
			)}

			<div className="flex gap-3">
				<button
					type="button"
					onClick={onClose}
					className="flex-1 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 font-medium hover:bg-neutral-50 transition-colors text-sm"
				>
					{locale === 'en' ? 'Cancel' : 'Cancelar'}
				</button>
				<button
					type="submit"
					disabled={state.submissionState === 'submitting'}
					className="flex-1 py-2.5 rounded-lg bg-[#04c597] text-white font-semibold hover:bg-[#036b54] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{state.submissionState === 'submitting'
						? (locale === 'en' ? 'Sending…' : 'Enviando…')
						: (locale === 'en' ? 'Send Quote Request' : 'Enviar Solicitação')}
				</button>
			</div>
		</form>
	);
}
