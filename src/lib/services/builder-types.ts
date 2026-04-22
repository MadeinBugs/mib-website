import type {
	Currency,
	Locale,
	ServiceCategory,
	SelectedServiceItem,
	SelectedConfiguration,
	SubmittedCustomFieldValue,
} from './types';

// ---------------------------------------------------------------------------
// Builder state
// ---------------------------------------------------------------------------

export interface BuilderState {
	locale: Locale;
	currency: Currency;
	selectedItems: Record<string, SelectedServiceItem>;
	maintenanceMonths: 0 | 3 | 6 | 12;
	clientInfo: {
		name: string;
		email: string;
		studioName: string;
		studioWebsite: string;
		message: string;
	};
	consentAccepted: boolean;
	expandedCategories: ServiceCategory[];
	expandedServices: string[];
	submissionState: 'idle' | 'submitting' | 'success' | 'error';
	submissionError: string | null;
	submittedQuoteId: string | null;
	/** Services that were auto-added as dependencies, keyed by serviceId → reason serviceId */
	autoAdded: Record<string, string>;
	/** Services auto-added by bundle logic (e.g. studio-control-panel when bundled free) */
	bundleAdded: string[];
	/** Banner dismissed by user */
	bannerDismissed: boolean;
	/** Attribution ref parameter */
	refParam: string | null;
}

// ---------------------------------------------------------------------------
// Reducer actions
// ---------------------------------------------------------------------------

export type BuilderAction =
	| { type: 'TOGGLE_SERVICE'; serviceId: string }
	| { type: 'SET_CONFIGURATION'; serviceId: string; configurationId: string; optionIds: string[] }
	| { type: 'ADD_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; value: string }
	| { type: 'UPDATE_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; index: number; value: string }
	| { type: 'REMOVE_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; index: number }
	| { type: 'SET_MAINTENANCE_MONTHS'; months: 0 | 3 | 6 | 12 }
	| { type: 'SET_CURRENCY'; currency: Currency }
	| { type: 'UPDATE_CLIENT_INFO'; field: keyof BuilderState['clientInfo']; value: string }
	| { type: 'SET_CONSENT'; accepted: boolean }
	| { type: 'TOGGLE_CATEGORY'; category: ServiceCategory }
	| { type: 'TOGGLE_SERVICE_EXPANDED'; serviceId: string }
	| { type: 'SUBMIT_START' }
	| { type: 'SUBMIT_SUCCESS'; quoteId: string }
	| { type: 'SUBMIT_ERROR'; error: string }
	| { type: 'DISMISS_BANNER' }
	| { type: 'SET_REF_PARAM'; ref: string }
	| { type: 'RESTORE_STATE'; state: Partial<BuilderState> };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function createInitialState(locale: Locale): BuilderState {
	return {
		locale,
		currency: locale === 'pt-BR' ? 'BRL' : 'USD',
		selectedItems: {},
		maintenanceMonths: 0,
		clientInfo: {
			name: '',
			email: '',
			studioName: '',
			studioWebsite: '',
			message: '',
		},
		consentAccepted: false,
		expandedCategories: [],
		expandedServices: [],
		submissionState: 'idle',
		submissionError: null,
		submittedQuoteId: null,
		autoAdded: {},
		bundleAdded: [],
		bannerDismissed: false,
		refParam: null,
	};
}

/** Build default SelectedServiceItem for a newly-toggled service */
export function buildDefaultSelection(
	serviceId: string,
	configurations: Array<{
		id: string;
		type: 'single-select' | 'multi-select';
		required: boolean;
		defaultOptionId?: string;
	}> | undefined
): SelectedServiceItem {
	const configs: SelectedConfiguration[] = [];
	if (configurations) {
		for (const config of configurations) {
			if (config.type === 'single-select' && config.defaultOptionId) {
				configs.push({
					configurationId: config.id,
					selectedOptionIds: [config.defaultOptionId],
				});
			} else {
				configs.push({
					configurationId: config.id,
					selectedOptionIds: [],
				});
			}
		}
	}
	return {
		serviceId,
		configurations: configs,
		customFields: [],
	};
}
