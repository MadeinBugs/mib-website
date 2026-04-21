'use client';

import { useReducer, useMemo, useState, useEffect, useCallback } from 'react';
import type { ServiceItem, ServiceCategory, Locale } from '@/lib/services/types';
import { createInitialState } from '@/lib/services/builder-types';
import type { BuilderState } from '@/lib/services/builder-types';
import { builderReducer } from '@/lib/services/builder-reducer';
import { collectDeliverables } from '@/lib/services/pricing';
import CategorySection from '@/components/services/builder/CategorySection';
import SummaryPanel from '@/components/services/summary/SummaryPanel';
import ClientDeliverablesPanel from '@/components/services/deliverables/ClientDeliverablesPanel';
import QuoteSubmitForm from '@/components/services/form/QuoteSubmitForm';
import Modal from '@/components/shared/Modal';
import Link from 'next/link';

const STORAGE_KEY = 'mib-infra-builder-state';

interface InfraBuilderClientProps {
	locale: Locale;
	catalog: ServiceItem[];
}

// Group catalog by category, preserving insertion order
function groupByCategory(catalog: ServiceItem[]): Array<{ category: ServiceCategory; services: ServiceItem[] }> {
	const map = new Map<ServiceCategory, ServiceItem[]>();
	for (const service of catalog) {
		if (!service.active) continue;
		const list = map.get(service.category) ?? [];
		list.push(service);
		map.set(service.category, list);
	}
	return Array.from(map.entries()).map(([category, services]) => ({ category, services }));
}

function loadSavedState(): Partial<BuilderState> | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function saveState(state: BuilderState) {
	try {
		const { submissionState, submissionError, submittedQuoteId, ...persistable } = state;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
	} catch {
		// Storage full or unavailable
	}
}

export default function InfraBuilderClient({ locale, catalog }: InfraBuilderClientProps) {
	const reducer = useMemo(() => builderReducer(catalog), [catalog]);
	const [state, dispatch] = useReducer(reducer, locale, createInitialState);
	const [showSubmitForm, setShowSubmitForm] = useState(false);
	const [showMobileSummary, setShowMobileSummary] = useState(false);

	// Restore state from localStorage on mount
	useEffect(() => {
		const saved = loadSavedState();
		if (saved && saved.selectedItems && Object.keys(saved.selectedItems).length > 0) {
			dispatch({ type: 'RESTORE_STATE', state: saved });
		}
	}, []);

	// Read URL params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const categoryParam = params.get('category');
		const refParam = params.get('ref');

		if (categoryParam) {
			dispatch({ type: 'TOGGLE_CATEGORY', category: categoryParam as ServiceCategory });
		}
		if (refParam) {
			dispatch({ type: 'SET_REF_PARAM', ref: refParam });
		}
	}, []);

	// Persist state changes
	useEffect(() => {
		saveState(state);
	}, [state]);

	const groups = useMemo(() => groupByCategory(catalog), [catalog]);
	const selectedCount = Object.keys(state.selectedItems).length;
	const allSelectedIds = useMemo(() => new Set(Object.keys(state.selectedItems)), [state.selectedItems]);

	const deliverables = useMemo(
		() => collectDeliverables(catalog, Object.values(state.selectedItems)),
		[catalog, state.selectedItems]
	);

	const handleSubmitClick = useCallback(() => {
		setShowSubmitForm(true);
		setShowMobileSummary(false);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6">
					<Link
						href={`/${locale}/services`}
						className="text-sm text-[#04c597] hover:underline mb-2 inline-block"
					>
						{locale === 'en' ? '← Back to services' : '← Voltar aos serviços'}
					</Link>
					<h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
						{locale === 'en' ? 'Infrastructure Builder' : 'Builder de Infraestrutura'}
					</h1>
					<p className="text-neutral-600 mt-1 text-sm sm:text-base">
						{locale === 'en'
							? 'Select the services you need and get an instant quote.'
							: 'Selecione os serviços que precisa e obtenha um orçamento instantâneo.'}
					</p>
				</div>

				{/* Banner */}
				{!state.bannerDismissed && selectedCount === 0 && (
					<div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 flex items-start justify-between gap-4">
						<div>
							<p className="text-sm font-medium text-blue-800">
								{locale === 'en'
									? 'Not sure what you need? Talk to us first!'
									: 'Não sabe o que precisa? Fale conosco primeiro!'}
							</p>
							<p className="text-xs text-blue-600 mt-0.5">
								{locale === 'en'
									? 'Schedule a free consultation to discuss your project.'
									: 'Agende uma consulta gratuita para discutir seu projeto.'}
							</p>
						</div>
						<button
							type="button"
							onClick={() => dispatch({ type: 'DISMISS_BANNER' })}
							className="shrink-0 text-blue-400 hover:text-blue-600 text-lg leading-none"
							aria-label="Dismiss"
						>
							✕
						</button>
					</div>
				)}

				{/* Main layout: two-column on desktop */}
				<div className="lg:flex lg:gap-6 lg:items-start">
					{/* Left: categories */}
					<div className="flex-1 space-y-4 min-w-0">
						{groups.map(({ category, services }) => (
							<CategorySection
								key={category}
								category={category}
								services={services}
								locale={locale}
								currency={state.currency}
								selectedItems={state.selectedItems}
								expandedServices={state.expandedServices}
								isExpanded={state.expandedCategories.includes(category)}
								autoAdded={state.autoAdded}
								allSelectedIds={allSelectedIds}
								catalog={catalog}
								dispatch={dispatch}
							/>
						))}
					</div>

					{/* Right: sticky summary (desktop only) */}
					<div className="hidden lg:block lg:w-96 lg:shrink-0 lg:sticky lg:top-6">
						<SummaryPanel
							catalog={catalog}
							selectedItems={state.selectedItems}
							locale={locale}
							currency={state.currency}
							maintenanceMonths={state.maintenanceMonths}
							dispatch={dispatch}
							onSubmitClick={handleSubmitClick}
						/>
						{deliverables.length > 0 && (
							<div className="mt-4">
								<ClientDeliverablesPanel deliverables={deliverables} locale={locale} />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile floating pill */}
			{selectedCount > 0 && (
				<div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
					<button
						type="button"
						onClick={() => setShowMobileSummary(true)}
						className="w-full flex items-center justify-between px-5 py-3.5 rounded-full bg-[#04c597] text-white font-semibold shadow-lg hover:bg-[#036b54] transition-colors"
					>
						<span>
							{locale === 'en' ? 'View Summary' : 'Ver Resumo'}
							<span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
								{selectedCount}
							</span>
						</span>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
						</svg>
					</button>
				</div>
			)}

			{/* Mobile summary modal */}
			<Modal
				isOpen={showMobileSummary}
				onClose={() => setShowMobileSummary(false)}
				title={locale === 'en' ? 'Summary' : 'Resumo'}
				size="full"
			>
				<div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
					<SummaryPanel
						catalog={catalog}
						selectedItems={state.selectedItems}
						locale={locale}
						currency={state.currency}
						maintenanceMonths={state.maintenanceMonths}
						dispatch={dispatch}
						onSubmitClick={handleSubmitClick}
					/>
					{deliverables.length > 0 && (
						<ClientDeliverablesPanel deliverables={deliverables} locale={locale} />
					)}
				</div>
			</Modal>

			{/* Submit form modal */}
			<Modal
				isOpen={showSubmitForm}
				onClose={() => setShowSubmitForm(false)}
				title={locale === 'en' ? 'Request Quote' : 'Solicitar Orçamento'}
				size="md"
			>
				<div className="p-5">
					<QuoteSubmitForm
						locale={locale}
						state={state}
						dispatch={dispatch}
						onClose={() => setShowSubmitForm(false)}
					/>
				</div>
			</Modal>
		</div>
	);
}
