export type Currency = 'BRL' | 'USD';
export type Locale = 'en' | 'pt-BR';

export interface BilingualString {
	en: string;
	'pt-BR': string;
}

export interface Price {
	BRL: number;
	USD: number;
}

export type ServiceCategory =
	| 'infrastructure'
	| 'cicd'
	| 'automation'
	| 'crm'
	| 'marketing'
	| 'analytics'
	| 'team-management'
	| 'social-media'
	| 'web-gamedev';

export type DeliverableType =
	| 'domain'
	| 'account-access'
	| 'api-key'
	| 'credentials'
	| 'decision'
	| 'payment-method'
	| 'other';

export interface ClientDeliverable {
	id: string;
	type: DeliverableType;
	label: BilingualString;
	description?: BilingualString;
}

export interface ThirdPartyCost {
	id: string;
	label: BilingualString;
	amount: Price;
	amountMax?: Price;
	frequency: 'monthly' | 'yearly' | 'one-time';
	note?: BilingualString;
	providerUrl?: string;
}

export interface MaintenancePlan {
	price: Price;
	scope?: BilingualString;
}

export interface ServiceConfigurationOption {
	id: string;
	label: BilingualString;
	description?: BilingualString;
	priceModifier: Price;
	maintenanceModifier?: Price;
	thirdPartyCosts?: ThirdPartyCost[];
	additionalDeliverables?: ClientDeliverable[];
	additionalRequires?: string[];
}

export interface ServiceConfiguration {
	id: string;
	label: BilingualString;
	description?: BilingualString;
	type: 'single-select' | 'multi-select';
	required: boolean;
	defaultOptionId?: string;
	options: ServiceConfigurationOption[];
}

export interface CustomField {
	id: string;
	label: BilingualString;
	helpText?: BilingualString;
	type: 'text' | 'textarea' | 'number';
	placeholder?: BilingualString;
	repeatable: boolean;
	pendingPricing: boolean;
	minItems?: number;
	maxItems?: number;
	minLength?: number;
	maxLength?: number;
}

export interface ServiceItem {
	id: string;
	category: ServiceCategory;
	name: BilingualString;
	shortDescription: BilingualString;
	longDescription: BilingualString;

	basePrice: Price;
	maintenance: MaintenancePlan | null;

	configurations?: ServiceConfiguration[];
	customFields?: CustomField[];

	requires?: string[];
	recommends?: string[];
	conflictsWith?: string[];

	clientDeliverables: ClientDeliverable[];
	thirdPartyCosts?: ThirdPartyCost[];

	estimatedSetupDays?: number;

	active: boolean;
}

// --- Submission payload types (client → server) ---

export interface SelectedConfiguration {
	configurationId: string;
	selectedOptionIds: string[];
}

export interface SubmittedCustomFieldValue {
	customFieldId: string;
	values: string[];
}

export interface SelectedServiceItem {
	serviceId: string;
	configurations: SelectedConfiguration[];
	customFields: SubmittedCustomFieldValue[];
}

// --- Snapshot stored in Supabase JSONB ---

export interface SelectedItemSnapshot {
	serviceId: string;
	serviceName: BilingualString;
	serviceCategory: ServiceCategory;
	basePrice: Price;
	configurations: Array<{
		configurationId: string;
		configurationLabel: BilingualString;
		selectedOptions: Array<{
			optionId: string;
			optionLabel: BilingualString;
			priceModifier: Price;
		}>;
	}>;
	customFields: Array<{
		customFieldId: string;
		customFieldLabel: BilingualString;
		values: string[];
		pendingPricing: boolean;
	}>;
	maintenancePrice: Price | null;
	maintenanceBreakdown?: {
		base: Price;
		modifiers: Array<{ optionId: string; amount: Price }>;
	};
	deliverables: ClientDeliverable[];
	thirdPartyCosts: ThirdPartyCost[];
	/** Business-rule discount applied (e.g. studio-control-panel bundled free) */
	bundledFree?: boolean;
}

export interface QuoteSubmission {
	locale: Locale;
	currency: Currency;
	selectedItems: SelectedServiceItem[];
	maintenanceMonths: 0 | 3 | 6 | 12;
	clientInfo: {
		name: string;
		email: string;
		studioName?: string;
		studioWebsite?: string;
		message?: string;
	};
	consentAccepted: boolean;
	termsVersion: string;
	catalogVersion: string;
	honeypot: string;
	refParam?: string;
	clientComputedTotal: number;
}

export interface ComputedTotals {
	setup: number;
	maintenanceMonthly: number;
	maintenanceTotal: number;
	grandTotal: number;
}

export type ValidationErrorCode =
	| 'INVALID_PAYLOAD'
	| 'SERVICE_NOT_FOUND'
	| 'CONFIGURATION_NOT_FOUND'
	| 'OPTION_NOT_FOUND'
	| 'REQUIRED_CONFIGURATION_MISSING'
	| 'CUSTOM_FIELD_NOT_FOUND'
	| 'CUSTOM_FIELD_VALIDATION'
	| 'DEPENDENCY_MISSING'
	| 'CONFLICT_DETECTED'
	| 'PRICE_DRIFT_TOO_LARGE'
	| 'TERMS_VERSION_MISMATCH'
	| 'CATALOG_VERSION_MISMATCH'
	| 'HONEYPOT_TRIGGERED';

export type ValidationResult =
	| { ok: true; data: QuoteSubmission; computedTotals: ComputedTotals }
	| { ok: false; error: string; code: ValidationErrorCode };
