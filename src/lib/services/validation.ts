import { z } from 'zod';
import type {
	ServiceItem,
	QuoteSubmission,
	ComputedTotals,
	ValidationResult,
	ValidationErrorCode,
	Currency,
} from './types';
import { computeGrandTotal } from './pricing';
import { TERMS_VERSION } from './defaults';
import { CATALOG_VERSION } from './catalog-version.generated';

// --- Zod schemas ---

export const SelectedConfigurationSchema = z.object({
	configurationId: z.string().min(1).max(100),
	selectedOptionIds: z.array(z.string().min(1).max(100)).max(20),
});

export const SubmittedCustomFieldValueSchema = z.object({
	customFieldId: z.string().min(1).max(100),
	values: z.array(z.string().max(5000)).max(20),
});

export const SelectedServiceItemSchema = z.object({
	serviceId: z.string().min(1).max(100),
	configurations: z.array(SelectedConfigurationSchema).max(20),
	customFields: z.array(SubmittedCustomFieldValueSchema).max(20),
});

export const QuoteSubmissionSchema = z.object({
	locale: z.enum(['en', 'pt-BR']),
	currency: z.enum(['BRL', 'USD']),
	selectedItems: z.array(SelectedServiceItemSchema).min(1).max(50),
	maintenanceMonths: z.union([z.literal(0), z.literal(3), z.literal(6), z.literal(12)]),
	clientInfo: z.object({
		name: z.string().min(1).max(200),
		email: z.string().email().max(320),
		studioName: z.string().max(200).optional(),
		studioWebsite: z.string().max(500).optional(),
		message: z.string().max(5000).optional(),
	}),
	consentAccepted: z.literal(true),
	termsVersion: z.string().min(1).max(50),
	catalogVersion: z.string().min(1).max(50),
	honeypot: z.string().max(500),
	refParam: z.string().max(100).optional(),
	clientComputedTotal: z.number().nonnegative(),
});

export type ValidatedSubmission = z.infer<typeof QuoteSubmissionSchema>;

// --- Business rule validation ---

function makeError(error: string, code: ValidationErrorCode): ValidationResult {
	return { ok: false, error, code };
}

export function validateSubmissionAgainstCatalog(
	submission: QuoteSubmission,
	catalog: ServiceItem[]
): ValidationResult {
	const { selectedItems, currency, maintenanceMonths } = submission;

	const selectedServiceIds = new Set(selectedItems.map((si) => si.serviceId));

	for (const item of selectedItems) {
		// Rule 1: Service exists and is active
		const service = catalog.find((s) => s.id === item.serviceId);
		if (!service || !service.active) {
			return makeError('One or more selected services are unavailable.', 'SERVICE_NOT_FOUND');
		}

		// Rule 2-4: Configurations
		for (const selConfig of item.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) {
				return makeError('Invalid configuration selected.', 'CONFIGURATION_NOT_FOUND');
			}

			// Rule 3: Option IDs exist
			for (const optionId of selConfig.selectedOptionIds) {
				if (!config.options.find((o) => o.id === optionId)) {
					return makeError('Invalid option selected.', 'OPTION_NOT_FOUND');
				}
			}

			// Rule 4: Single-select has exactly 1; multi-select has 0+
			if (config.type === 'single-select' && selConfig.selectedOptionIds.length !== 1) {
				return makeError('Single-select configuration must have exactly one option.', 'REQUIRED_CONFIGURATION_MISSING');
			}
		}

		// Rule 5: All required configurations have values
		if (service.configurations) {
			for (const config of service.configurations) {
				if (!config.required) continue;
				const selConfig = item.configurations.find((c) => c.configurationId === config.id);
				if (!selConfig || selConfig.selectedOptionIds.length === 0) {
					return makeError(`Required configuration "${config.id}" missing for "${service.id}".`, 'REQUIRED_CONFIGURATION_MISSING');
				}
			}
		}

		// Rule 6-8: Custom fields
		for (const cf of item.customFields) {
			const fieldDef = service.customFields?.find((f) => f.id === cf.customFieldId);
			if (!fieldDef) {
				return makeError('Invalid custom field.', 'CUSTOM_FIELD_NOT_FOUND');
			}

			// Rule 8: Non-repeatable must have exactly 1 value
			if (!fieldDef.repeatable && cf.values.length !== 1) {
				return makeError('Non-repeatable field must have exactly one value.', 'CUSTOM_FIELD_VALIDATION');
			}

			// Rule 7: Respect min/max
			if (fieldDef.repeatable) {
				if (fieldDef.minItems !== undefined && cf.values.length < fieldDef.minItems) {
					return makeError(`Field "${fieldDef.id}" requires at least ${fieldDef.minItems} entries.`, 'CUSTOM_FIELD_VALIDATION');
				}
				if (fieldDef.maxItems !== undefined && cf.values.length > fieldDef.maxItems) {
					return makeError(`Field "${fieldDef.id}" allows at most ${fieldDef.maxItems} entries.`, 'CUSTOM_FIELD_VALIDATION');
				}
			}

			for (const value of cf.values) {
				if (fieldDef.minLength !== undefined && value.length < fieldDef.minLength) {
					return makeError(`Field "${fieldDef.id}" value too short.`, 'CUSTOM_FIELD_VALIDATION');
				}
				if (fieldDef.maxLength !== undefined && value.length > fieldDef.maxLength) {
					return makeError(`Field "${fieldDef.id}" value too long.`, 'CUSTOM_FIELD_VALIDATION');
				}
			}
		}

		// Rule 9: Dependencies
		if (service.requires) {
			for (const depId of service.requires) {
				if (!selectedServiceIds.has(depId)) {
					return makeError(`Service "${service.id}" requires "${depId}" which is not selected.`, 'DEPENDENCY_MISSING');
				}
			}
		}

		// Also check additionalRequires from selected configuration options
		for (const selConfig of item.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) continue;
			for (const optionId of selConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (option?.additionalRequires) {
					for (const depId of option.additionalRequires) {
						if (!selectedServiceIds.has(depId)) {
							return makeError(`Configuration option requires "${depId}" which is not selected.`, 'DEPENDENCY_MISSING');
						}
					}
				}
			}
		}
	}

	// Rule 10: No conflicts
	for (const item of selectedItems) {
		const service = catalog.find((s) => s.id === item.serviceId);
		if (!service?.conflictsWith) continue;
		for (const conflictId of service.conflictsWith) {
			if (selectedServiceIds.has(conflictId)) {
				return makeError(`Services "${service.id}" and "${conflictId}" conflict with each other.`, 'CONFLICT_DETECTED');
			}
		}
	}

	// Rule 7, 11, 13: Compute server-side total and check drift
	const computedTotals = computeGrandTotal(
		catalog,
		selectedItems,
		currency as Currency,
		maintenanceMonths
	);

	const serverTotal = computedTotals.grandTotal;
	const clientTotal = submission.clientComputedTotal;
	const diff = Math.abs(serverTotal - clientTotal);

	// Rule 13: Catalog version check
	const catalogVersionMatches = submission.catalogVersion === CATALOG_VERSION;
	const termsVersionMatches = submission.termsVersion === TERMS_VERSION;

	if (diff > 0.01) {
		const driftPercent = serverTotal > 0 ? diff / serverTotal : diff;

		if (driftPercent > 0.10) {
			if (!catalogVersionMatches) {
				return makeError(
					'Our catalog has been updated since you started. Please refresh and review your package.',
					'CATALOG_VERSION_MISMATCH'
				);
			}
			if (!termsVersionMatches) {
				return makeError(
					'Our terms have been updated since you started. Please refresh and review your package.',
					'TERMS_VERSION_MISMATCH'
				);
			}
			return makeError(
				'Our pricing has been updated since you started. Please review your package and try again.',
				'PRICE_DRIFT_TOO_LARGE'
			);
		}

		// Within 10% but > 0.01: accept with warning (logged elsewhere)
	}

	return {
		ok: true,
		data: submission,
		computedTotals,
	};
}
