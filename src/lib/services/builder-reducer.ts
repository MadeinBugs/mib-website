import type { ServiceItem } from './types';
import type { BuilderState, BuilderAction } from './builder-types';
import { buildDefaultSelection } from './builder-types';
import { resolveDependencies, findDependents } from './dependencies';

/**
 * Collect the selectedOptionIds map for a service from the builder state.
 */
function getOptionIdsMap(state: BuilderState, serviceId: string): Record<string, string[]> {
	const item = state.selectedItems[serviceId];
	if (!item) return {};
	const map: Record<string, string[]> = {};
	for (const c of item.configurations) {
		map[c.configurationId] = c.selectedOptionIds;
	}
	return map;
}

export function builderReducer(catalog: ServiceItem[]) {
	return function reducer(state: BuilderState, action: BuilderAction): BuilderState {
		switch (action.type) {
			case 'TOGGLE_SERVICE': {
				const { serviceId } = action;
				const isSelected = serviceId in state.selectedItems;

				if (isSelected) {
					// Deselecting — cascade-remove dependents
					const currentlySelected = new Set(Object.keys(state.selectedItems));
					const dependents = findDependents(catalog, serviceId, currentlySelected);
					const toRemove = new Set([serviceId, ...dependents]);

					const newItems = { ...state.selectedItems };
					const newAutoAdded = { ...state.autoAdded };
					for (const id of toRemove) {
						delete newItems[id];
						delete newAutoAdded[id];
					}

					return {
						...state,
						selectedItems: newItems,
						autoAdded: newAutoAdded,
					};
				}

				// Selecting — resolve dependencies
				const service = catalog.find((s) => s.id === serviceId);
				if (!service || !service.active) return state;

				// Check conflicts
				const currentlySelected = new Set(Object.keys(state.selectedItems));
				if (service.conflictsWith) {
					for (const conflictId of service.conflictsWith) {
						if (currentlySelected.has(conflictId)) {
							// Block selection — conflict exists
							return state;
						}
					}
				}

				// Build default selection
				const newItem = buildDefaultSelection(serviceId, service.configurations);
				const optionIdsMap: Record<string, string[]> = {};
				for (const c of newItem.configurations) {
					optionIdsMap[c.configurationId] = c.selectedOptionIds;
				}

				// Resolve transitive dependencies
				const allRequired = resolveDependencies(catalog, serviceId, optionIdsMap);

				const newItems = { ...state.selectedItems, [serviceId]: newItem };
				const newAutoAdded = { ...state.autoAdded };

				for (const depId of allRequired) {
					if (depId === serviceId) continue;
					if (depId in newItems) continue; // already selected
					const depService = catalog.find((s) => s.id === depId);
					if (!depService || !depService.active) continue;
					newItems[depId] = buildDefaultSelection(depId, depService.configurations);
					newAutoAdded[depId] = serviceId;
				}

				// Auto-expand the category
				const expandedCategories = state.expandedCategories.includes(service.category)
					? state.expandedCategories
					: [...state.expandedCategories, service.category];

				return {
					...state,
					selectedItems: newItems,
					autoAdded: newAutoAdded,
					expandedCategories,
				};
			}

			case 'SET_CONFIGURATION': {
				const { serviceId, configurationId, optionIds } = action;
				const existing = state.selectedItems[serviceId];
				if (!existing) return state;

				const updatedConfigs = existing.configurations.map((c) =>
					c.configurationId === configurationId
						? { ...c, selectedOptionIds: optionIds }
						: c
				);

				const updatedItem = { ...existing, configurations: updatedConfigs };
				const newItems = { ...state.selectedItems, [serviceId]: updatedItem };

				// Re-resolve dependencies for the new option
				const optionIdsMap = getOptionIdsMap(
					{ ...state, selectedItems: newItems },
					serviceId
				);
				const allRequired = resolveDependencies(catalog, serviceId, optionIdsMap);
				const newAutoAdded = { ...state.autoAdded };

				for (const depId of allRequired) {
					if (depId === serviceId) continue;
					if (depId in newItems) continue;
					const depService = catalog.find((s) => s.id === depId);
					if (!depService || !depService.active) continue;
					newItems[depId] = buildDefaultSelection(depId, depService.configurations);
					newAutoAdded[depId] = serviceId;
				}

				return { ...state, selectedItems: newItems, autoAdded: newAutoAdded };
			}

			case 'ADD_CUSTOM_FIELD_VALUE': {
				const { serviceId, customFieldId, value } = action;
				const existing = state.selectedItems[serviceId];
				if (!existing) return state;

				const cfIndex = existing.customFields.findIndex((cf) => cf.customFieldId === customFieldId);
				let updatedCustomFields;
				if (cfIndex >= 0) {
					updatedCustomFields = existing.customFields.map((cf, i) =>
						i === cfIndex ? { ...cf, values: [...cf.values, value] } : cf
					);
				} else {
					updatedCustomFields = [
						...existing.customFields,
						{ customFieldId, values: [value] },
					];
				}

				return {
					...state,
					selectedItems: {
						...state.selectedItems,
						[serviceId]: { ...existing, customFields: updatedCustomFields },
					},
				};
			}

			case 'UPDATE_CUSTOM_FIELD_VALUE': {
				const { serviceId, customFieldId, index, value } = action;
				const existing = state.selectedItems[serviceId];
				if (!existing) return state;

				const updatedCustomFields = existing.customFields.map((cf) => {
					if (cf.customFieldId !== customFieldId) return cf;
					const newValues = [...cf.values];
					newValues[index] = value;
					return { ...cf, values: newValues };
				});

				return {
					...state,
					selectedItems: {
						...state.selectedItems,
						[serviceId]: { ...existing, customFields: updatedCustomFields },
					},
				};
			}

			case 'REMOVE_CUSTOM_FIELD_VALUE': {
				const { serviceId, customFieldId, index } = action;
				const existing = state.selectedItems[serviceId];
				if (!existing) return state;

				const updatedCustomFields = existing.customFields.map((cf) => {
					if (cf.customFieldId !== customFieldId) return cf;
					const newValues = cf.values.filter((_, i) => i !== index);
					return { ...cf, values: newValues };
				});

				return {
					...state,
					selectedItems: {
						...state.selectedItems,
						[serviceId]: { ...existing, customFields: updatedCustomFields },
					},
				};
			}

			case 'SET_MAINTENANCE_MONTHS':
				return { ...state, maintenanceMonths: action.months };

			case 'SET_CURRENCY':
				return { ...state, currency: action.currency };

			case 'UPDATE_CLIENT_INFO':
				return {
					...state,
					clientInfo: { ...state.clientInfo, [action.field]: action.value },
				};

			case 'SET_CONSENT':
				return { ...state, consentAccepted: action.accepted };

			case 'TOGGLE_CATEGORY': {
				const { category } = action;
				const idx = state.expandedCategories.indexOf(category);
				return {
					...state,
					expandedCategories:
						idx >= 0
							? state.expandedCategories.filter((c) => c !== category)
							: [...state.expandedCategories, category],
				};
			}

			case 'TOGGLE_SERVICE_EXPANDED': {
				const { serviceId } = action;
				const idx = state.expandedServices.indexOf(serviceId);
				return {
					...state,
					expandedServices:
						idx >= 0
							? state.expandedServices.filter((s) => s !== serviceId)
							: [...state.expandedServices, serviceId],
				};
			}

			case 'SUBMIT_START':
				return { ...state, submissionState: 'submitting', submissionError: null };

			case 'SUBMIT_SUCCESS':
				return {
					...state,
					submissionState: 'success',
					submittedQuoteId: action.quoteId,
					selectedItems: {},
					autoAdded: {},
				};

			case 'SUBMIT_ERROR':
				return { ...state, submissionState: 'error', submissionError: action.error };

			case 'DISMISS_BANNER':
				return { ...state, bannerDismissed: true };

			case 'SET_REF_PARAM':
				return { ...state, refParam: action.ref };

			case 'RESTORE_STATE':
				return { ...state, ...action.state };

			default:
				return state;
		}
	};
}
