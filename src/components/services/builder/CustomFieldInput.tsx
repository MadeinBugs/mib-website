'use client';

import type { CustomField, Locale } from '../../../lib/services/types';
import PendingPricingBadge from './PendingPricingBadge';

interface CustomFieldInputProps {
	field: CustomField;
	values: string[];
	locale: Locale;
	onAdd: (value: string) => void;
	onUpdate: (index: number, value: string) => void;
	onRemove: (index: number) => void;
}

export default function CustomFieldInput({
	field,
	values,
	locale,
	onAdd,
	onUpdate,
	onRemove,
}: CustomFieldInputProps) {
	const canAdd = field.repeatable && (!field.maxItems || values.length < field.maxItems);
	const placeholder = field.placeholder?.[locale] ?? '';

	const renderInput = (value: string, index: number) => {
		const InputTag = field.type === 'textarea' ? 'textarea' : 'input';
		return (
			<div key={index} className="flex items-start gap-2">
				<InputTag
					value={value}
					onChange={(e) => onUpdate(index, e.target.value)}
					placeholder={placeholder}
					type={field.type === 'number' ? 'number' : undefined}
					rows={field.type === 'textarea' ? 3 : undefined}
					minLength={field.minLength}
					maxLength={field.maxLength}
					className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-[#04c597] focus:ring-1 focus:ring-[#04c597] outline-none transition-colors resize-y"
				/>
				{field.repeatable && values.length > (field.minItems ?? 0) && (
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="shrink-0 p-2 text-neutral-400 hover:text-red-500 transition-colors"
						aria-label={locale === 'en' ? 'Remove' : 'Remover'}
					>
						✕
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<label className="text-sm font-medium text-neutral-700">
					{field.label[locale]}
				</label>
				{field.pendingPricing && <PendingPricingBadge locale={locale} />}
			</div>
			{field.helpText && (
				<p className="text-xs text-neutral-500">{field.helpText[locale]}</p>
			)}

			{values.length === 0 && !field.repeatable ? (
				renderInput('', 0)
			) : (
				<div className="space-y-2">
					{values.map((val, i) => renderInput(val, i))}
				</div>
			)}

			{canAdd && (
				<button
					type="button"
					onClick={() => onAdd('')}
					className="text-sm text-[#04c597] hover:text-[#036b54] font-medium transition-colors"
				>
					+ {locale === 'en' ? 'Add another' : 'Adicionar outro'}
				</button>
			)}
		</div>
	);
}
