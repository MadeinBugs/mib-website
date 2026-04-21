'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceCategory, ServiceItem, Locale, Currency, SelectedServiceItem } from '../../../lib/services/types';
import type { BuilderAction } from '../../../lib/services/builder-types';
import ServiceCard from './ServiceCard';

const CATEGORY_LABELS: Record<ServiceCategory, { en: string; 'pt-BR': string }> = {
	infrastructure: { en: 'Infrastructure', 'pt-BR': 'Infraestrutura' },
	cicd: { en: 'CI/CD & DevOps', 'pt-BR': 'CI/CD & DevOps' },
	automation: { en: 'Automation', 'pt-BR': 'Automação' },
	crm: { en: 'CRM', 'pt-BR': 'CRM' },
	marketing: { en: 'Marketing & Email', 'pt-BR': 'Marketing & Email' },
	analytics: { en: 'Analytics & Monitoring', 'pt-BR': 'Analytics & Monitoramento' },
	'internal-tools': { en: 'Internal Tools', 'pt-BR': 'Ferramentas Internas' },
	'social-media': { en: 'Social Media', 'pt-BR': 'Mídias Sociais' },
	'web-gamedev': { en: 'Web & Game Dev', 'pt-BR': 'Web & Game Dev' },
};

const CATEGORY_ICONS: Record<ServiceCategory, string> = {
	infrastructure: '🏗️',
	cicd: '⚙️',
	automation: '⚡',
	crm: '📇',
	marketing: '📧',
	analytics: '📊',
	'internal-tools': '🔧',
	'social-media': '📱',
	'web-gamedev': '🎮',
};

interface CategorySectionProps {
	category: ServiceCategory;
	services: ServiceItem[];
	locale: Locale;
	currency: Currency;
	selectedItems: Record<string, SelectedServiceItem>;
	expandedServices: string[];
	isExpanded: boolean;
	autoAdded: Record<string, string>;
	allSelectedIds: Set<string>;
	catalog: ServiceItem[];
	dispatch: React.Dispatch<BuilderAction>;
}

export default function CategorySection({
	category,
	services,
	locale,
	currency,
	selectedItems,
	expandedServices,
	isExpanded,
	autoAdded,
	allSelectedIds,
	catalog,
	dispatch,
}: CategorySectionProps) {
	const selectedCount = services.filter((s) => s.id in selectedItems).length;

	return (
		<div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
			<button
				type="button"
				onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', category })}
				className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
			>
				<div className="flex items-center gap-3">
					<span className="text-xl">{CATEGORY_ICONS[category]}</span>
					<h2 className="font-bold text-neutral-800">
						{CATEGORY_LABELS[category][locale]}
					</h2>
					{selectedCount > 0 && (
						<span className="px-2 py-0.5 rounded-full bg-[#04c597] text-white text-xs font-medium">
							{selectedCount}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-neutral-400">
						{services.length} {locale === 'en' ? 'services' : 'serviços'}
					</span>
					<svg
						className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</button>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						<div className="px-5 pb-4 space-y-3 border-t border-neutral-100 pt-3">
							{services.map((service) => {
								// Compute conflicts for this service
								const conflictingNames: string[] = [];
								if (service.conflictsWith) {
									for (const conflictId of service.conflictsWith) {
										if (allSelectedIds.has(conflictId)) {
											const conflicting = catalog.find((s) => s.id === conflictId);
											if (conflicting) {
												conflictingNames.push(conflicting.name[locale]);
											}
										}
									}
								}

								// Get auto-added-by name
								const autoAddedByName = autoAdded[service.id]
									? (catalog.find((s) => s.id === autoAdded[service.id])?.name[locale] ?? null)
									: null;

								return (
									<ServiceCard
										key={service.id}
										service={service}
										locale={locale}
										currency={currency}
										selected={selectedItems[service.id] ?? null}
										isExpanded={expandedServices.includes(service.id)}
										autoAddedBy={autoAddedByName}
										conflictingNames={conflictingNames}
										dispatch={dispatch}
									/>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
