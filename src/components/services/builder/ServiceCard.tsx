'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceItem, Locale, Currency, SelectedServiceItem } from '../../../lib/services/types';
import type { BuilderAction } from '../../../lib/services/builder-types';
import { formatPrice } from '../../../lib/services/format';
import { FaLightbulb, FaGift } from 'react-icons/fa';
import ServiceConfigurator from './ServiceConfigurator';
import CustomFieldInput from './CustomFieldInput';
import DependencyIndicator from './DependencyIndicator';
import ConflictWarning from './ConflictWarning';
import PriceDisplay from '../shared/PriceDisplay';

interface ServiceCardProps {
	service: ServiceItem;
	locale: Locale;
	currency: Currency;
	selected: SelectedServiceItem | null;
	isExpanded: boolean;
	autoAddedBy: string | null;
	/** Names of conflicting services that are currently selected */
	conflictingNames: string[];
	/** True when this service is auto-added by bundle logic and cannot be toggled */
	isBundleLocked: boolean;
	catalog: ServiceItem[];
	dispatch: React.Dispatch<BuilderAction>;
}

export default function ServiceCard({
	service,
	locale,
	currency,
	selected,
	isExpanded,
	autoAddedBy,
	conflictingNames,
	isBundleLocked,
	catalog,
	dispatch,
}: ServiceCardProps) {
	const isSelected = selected !== null;
	const hasConflict = conflictingNames.length > 0;

	const handleToggle = () => {
		dispatch({ type: 'TOGGLE_SERVICE', serviceId: service.id });
	};

	const handleExpand = () => {
		dispatch({ type: 'TOGGLE_SERVICE_EXPANDED', serviceId: service.id });
	};

	return (
		<div
			className={`rounded-lg border-2 transition-all duration-200 ${isBundleLocked
				? 'border-service-accent bg-service-accent/10 shadow-sm'
				: isSelected
					? 'border-service-accent bg-service-accent/5 shadow-sm'
					: hasConflict
						? 'border-red-800 bg-red-950/30 opacity-75'
						: 'border-service-border bg-service-bg-elevated hover:border-service-border-strong'
				}`}
		>
			{/* Header row */}
			<div className="flex items-start gap-3 p-4">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={handleToggle}
					disabled={(hasConflict && !isSelected) || isBundleLocked}
					className={`mt-1 shrink-0 h-4 w-4 rounded border-service-border-strong focus:ring-service-accent ${isBundleLocked
						? 'text-service-accent cursor-not-allowed opacity-60'
						: 'text-service-accent disabled:opacity-50'
						}`}
					aria-label={service.name[locale]}
				/>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<button
							type="button"
							onClick={handleExpand}
							className="text-left"
						>
							<h3 className="font-semibold text-service-text-primary text-sm leading-tight">
								{service.name[locale]}
							</h3>
							<p className="text-xs text-service-text-secondary mt-0.5 line-clamp-2">
								{service.shortDescription[locale]}
							</p>
						</button>
						<div className="shrink-0 text-right">
							<PriceDisplay
								amount={service.basePrice[currency]}
								currency={currency}
								className="text-service-text-primary font-semibold"
								size="sm"
							/>
							{service.estimatedSetupDays && (
								<p className="text-[10px] text-service-text-tertiary mt-0.5">
									~{service.estimatedSetupDays}d setup
								</p>
							)}
						</div>
					</div>

					{/* Bundle-locked indicator */}
					{isBundleLocked && (
						<div className="mt-2 flex items-center gap-1.5 text-xs text-service-accent font-medium">
							<FaGift className="shrink-0" />
							{locale === 'en' ? 'Included free with your selection' : 'Incluso grátis com sua seleção'}
						</div>
					)}

					{/* Auto-added indicator */}
					{autoAddedBy && !isBundleLocked && (
						<div className="mt-2">
							<DependencyIndicator locale={locale} requiredByName={autoAddedBy} />
						</div>
					)}

					{/* Conflict warning */}
					{hasConflict && !isSelected && (
						<div className="mt-2">
							<ConflictWarning locale={locale} conflictingServiceNames={conflictingNames} />
						</div>
					)}
				</div>
				{/* Expand/collapse chevron */}
				<button
					type="button"
					onClick={handleExpand}
					className="shrink-0 p-1 text-service-text-tertiary hover:text-service-text-secondary transition-colors"
					aria-label={isExpanded ? 'Collapse' : 'Expand'}
				>
					<svg
						className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</div>

			{/* Expanded content */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 pt-0 space-y-4 border-t border-neutral-100">
							{/* Long description */}
							<p className="text-sm text-neutral-600 pt-3">
								{service.longDescription[locale]}
							</p>

							{/* Maintenance info */}
							{service.maintenance && (
								<div className="text-xs text-service-text-secondary bg-service-bg-strong rounded-md px-3 py-2">
									{locale === 'en' ? 'Maintenance: ' : 'Manutenção: '}
									<span className="font-medium text-service-text-primary">
										{formatPrice(service.maintenance.price[currency], currency)}/
										{locale === 'en' ? 'mo' : 'mês'}
									</span>
								</div>
							)}

							{/* Configurations (only when selected) */}
							{isSelected && service.configurations && service.configurations.length > 0 && (
								<div className="space-y-3">
									{service.configurations.map((config) => {
										const selectedConfig = selected!.configurations.find(
											(c) => c.configurationId === config.id
										);
										return (
											<ServiceConfigurator
												key={config.id}
												configuration={config}
												selectedOptionIds={selectedConfig?.selectedOptionIds ?? []}
												locale={locale}
												currency={currency}
												onChange={(optionIds) =>
													dispatch({
														type: 'SET_CONFIGURATION',
														serviceId: service.id,
														configurationId: config.id,
														optionIds,
													})
												}
											/>
										);
									})}
								</div>
							)}

							{/* Custom fields (only when selected) */}
							{isSelected && service.customFields && service.customFields.length > 0 && (
								<div className="space-y-3">
									{service.customFields.map((field) => {
										const existing = selected!.customFields.find(
											(cf) => cf.customFieldId === field.id
										);
										const values = existing?.values ?? (
											field.repeatable
												? Array(field.minItems ?? 0).fill('')
												: ['']
										);
										return (
											<CustomFieldInput
												key={field.id}
												field={field}
												values={values}
												locale={locale}
												onAdd={(value) =>
													dispatch({
														type: 'ADD_CUSTOM_FIELD_VALUE',
														serviceId: service.id,
														customFieldId: field.id,
														value,
													})
												}
												onUpdate={(index, value) =>
													dispatch({
														type: 'UPDATE_CUSTOM_FIELD_VALUE',
														serviceId: service.id,
														customFieldId: field.id,
														index,
														value,
													})
												}
												onRemove={(index) =>
													dispatch({
														type: 'REMOVE_CUSTOM_FIELD_VALUE',
														serviceId: service.id,
														customFieldId: field.id,
														index,
													})
												}
											/>
										);
									})}
								</div>
							)}

							{/* Requires / Recommends */}
							{service.requires && service.requires.length > 0 && (
								<p className="text-xs text-service-text-secondary">
									{locale === 'en' ? 'Requires: ' : 'Requer: '}
									{service.requires.map((id) => catalog.find((s) => s.id === id)?.name[locale] ?? id).join(', ')}
								</p>
							)}
							{service.recommends && service.recommends.length > 0 && (
								<p className="text-xs text-blue-400 flex items-center gap-1">
									<FaLightbulb className="shrink-0" />
									{locale === 'en' ? 'You may also want: ' : 'Você também pode querer: '}
									{service.recommends.map((id) => catalog.find((s) => s.id === id)?.name[locale] ?? id).join(', ')}
								</p>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
