'use client';

import type { ServiceConfiguration, Locale, Currency } from '../../../lib/services/types';
import { formatPrice } from '../../../lib/services/format';

interface ServiceConfiguratorProps {
	configuration: ServiceConfiguration;
	selectedOptionIds: string[];
	locale: Locale;
	currency: Currency;
	onChange: (optionIds: string[]) => void;
}

export default function ServiceConfigurator({
	configuration,
	selectedOptionIds,
	locale,
	currency,
	onChange,
}: ServiceConfiguratorProps) {
	if (configuration.type === 'single-select') {
		return (
			<div className="space-y-1">
				<label className="block text-sm font-medium text-service-text-secondary">
					{configuration.label[locale]}
					{configuration.required && <span className="text-red-500 ml-0.5">*</span>}
				</label>
				{configuration.description && (
					<p className="text-xs text-service-text-tertiary">{configuration.description[locale]}</p>
				)}
				<select
					value={selectedOptionIds[0] ?? ''}
					onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
					className="w-full rounded-lg border border-service-border bg-service-bg-strong px-3 py-2 text-sm text-service-text-primary focus:border-service-accent focus:ring-1 focus:ring-service-accent outline-none transition-colors"
				>
					{!configuration.required && (
						<option value="">
							{locale === 'en' ? '— Select —' : '— Selecione —'}
						</option>
					)}
					{configuration.options.map((opt) => {
						const mod = opt.priceModifier[currency];
						const modLabel = mod > 0 ? ` (+${formatPrice(mod, currency)})` : mod < 0 ? ` (${formatPrice(mod, currency)})` : '';
						return (
							<option key={opt.id} value={opt.id}>
								{opt.label[locale]}{modLabel}
							</option>
						);
					})}
				</select>
				{/* Show selected option description */}
				{selectedOptionIds[0] && (() => {
					const opt = configuration.options.find((o) => o.id === selectedOptionIds[0]);
					return opt?.description ? (
						<p className="text-xs text-service-text-tertiary mt-1 pl-1">{opt.description[locale]}</p>
					) : null;
				})()}
			</div>
		);
	}

	// Multi-select
	return (
		<div className="space-y-1">
			<label className="block text-sm font-medium text-service-text-secondary">
				{configuration.label[locale]}
				{configuration.required && <span className="text-red-500 ml-0.5">*</span>}
			</label>
			{configuration.description && (
				<p className="text-xs text-service-text-tertiary">{configuration.description[locale]}</p>
			)}
			<div className="space-y-1.5 mt-1">
				{configuration.options.map((opt) => {
					const isChecked = selectedOptionIds.includes(opt.id);
					const mod = opt.priceModifier[currency];
					const modLabel = mod > 0 ? ` (+${formatPrice(mod, currency)})` : '';

					return (
						<label key={opt.id} className="flex items-start gap-2 cursor-pointer group">
							<input
								type="checkbox"
								checked={isChecked}
								onChange={() => {
									const newIds = isChecked
										? selectedOptionIds.filter((id) => id !== opt.id)
										: [...selectedOptionIds, opt.id];
									onChange(newIds);
								}}
								className="mt-0.5 rounded border-service-border-strong text-service-accent focus:ring-service-accent"
							/>
							<span className="text-sm text-service-text-primary group-hover:text-service-text-primary">
								{opt.label[locale]}
								{modLabel && <span className="text-service-text-secondary">{modLabel}</span>}
							</span>
						</label>
					);
				})}
			</div>
		</div>
	);
}
