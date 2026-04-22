import type { ServiceItem, SelectedServiceItem } from './types';
import type { BuilderState, BuilderAction } from './builder-types';
import { buildDefaultSelection } from './builder-types';
import { resolveDependencies } from './dependencies';
import { isBundleEligible } from './bundling';

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

/**
 * Check whether a selected service actually requires `depId` given its
 * current configuration selections.
 */
function serviceActuallyRequires(
	catalog: ServiceItem[],
	selectedItem: SelectedServiceItem,
	depId: string
): boolean {
	const service = catalog.find((s) => s.id === selectedItem.serviceId);
	if (!service) return false;

	// Hard requires
	if (service.requires?.includes(depId)) return true;

	// Config-driven additionalRequires (only for actually selected options)
	if (service.configurations) {
		for (const config of service.configurations) {
			const selectedConfig = selectedItem.configurations.find(
				(c) => c.configurationId === config.id
			);
			if (!selectedConfig) continue;
			for (const optionId of selectedConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (option?.additionalRequires?.includes(depId)) return true;
			}
		}
	}

	return false;
}

/**
 * Smart deselect: remove the service and cascade-remove orphaned dependencies.
 *
 * For each auto-added dependency, check if any other remaining selected service
 * still requires it. If not, remove it too (and recurse for its own deps).
 * For non-auto-added services that hard-depend on the removed service, cascade-remove them.
 */
function computeSmartRemoval(
	catalog: ServiceItem[],
	state: BuilderState,
	serviceId: string
): Set<string> {
	const toRemove = new Set<string>([serviceId]);
	const queue = [serviceId];
	const remaining = new Set(Object.keys(state.selectedItems));

	while (queue.length > 0) {
		const current = queue.shift()!;
		remaining.delete(current);

		// 1. Find services that were auto-added by `current` — remove if orphaned
		for (const [depId, addedBy] of Object.entries(state.autoAdded)) {
			if (addedBy !== current) continue;
			if (toRemove.has(depId)) continue;

			// Check if any other remaining service still needs depId
			let stillNeeded = false;
			for (const otherId of remaining) {
				if (toRemove.has(otherId)) continue;
				const otherItem = state.selectedItems[otherId];
				if (!otherItem) continue;
				if (serviceActuallyRequires(catalog, otherItem, depId)) {
					stillNeeded = true;
					break;
				}
			}

			if (!stillNeeded) {
				toRemove.add(depId);
				queue.push(depId);
			}
		}

		// 2. Find services that hard-require `current` — must be removed
		for (const otherId of remaining) {
			if (toRemove.has(otherId)) continue;
			const otherItem = state.selectedItems[otherId];
			if (!otherItem) continue;
			if (serviceActuallyRequires(catalog, otherItem, current)) {
				toRemove.add(otherId);
				queue.push(otherId);
			}
		}
	}

	return toRemove;
}

export function builderReducer(catalog: ServiceItem[]) {
	return function reducer(state: BuilderState, action: BuilderAction): BuilderState {
		switch (action.type) {
			case 'TOGGLE_SERVICE': {
				const { serviceId } = action;

				// Block toggling a bundle-locked service
				if (state.bundleAdded.includes(serviceId)) return state;

				const isSelected = serviceId in state.selectedItems;

				if (isSelected) {
					// Deselecting — smart cascade-remove orphaned auto-added deps
					const toRemove = computeSmartRemoval(catalog, state, serviceId);

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
				let newItems = { ...state.selectedItems, [serviceId]: updatedItem };
				let newAutoAdded = { ...state.autoAdded };

				// Re-resolve dependencies for the new option
				const optionIdsMap = getOptionIdsMap(
					{ ...state, selectedItems: newItems },
					serviceId
				);
				const allRequired = resolveDependencies(catalog, serviceId, optionIdsMap);

				// Add any new deps
				for (const depId of allRequired) {
					if (depId === serviceId) continue;
					if (depId in newItems) continue;
					const depService = catalog.find((s) => s.id === depId);
					if (!depService || !depService.active) continue;
					newItems[depId] = buildDefaultSelection(depId, depService.configurations);
					newAutoAdded[depId] = serviceId;
				}

				// Remove orphaned auto-added deps that were added by this service
				// but are no longer required by the new configuration
				const requiredSet = new Set(allRequired);
				for (const [depId, addedBy] of Object.entries(newAutoAdded)) {
					if (addedBy !== serviceId) continue;
					if (requiredSet.has(depId)) continue;

					// Check if any other service still needs it
					let stillNeeded = false;
					for (const [otherId, otherItem] of Object.entries(newItems)) {
						if (otherId === serviceId || otherId === depId) continue;
						if (serviceActuallyRequires(catalog, otherItem, depId)) {
							stillNeeded = true;
							break;
						}
					}
					if (!stillNeeded) {
						delete newItems[depId];
						delete newAutoAdded[depId];
					}
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
					bundleAdded: [],
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

// ---------------------------------------------------------------------------
// Bundle reconciliation
// ---------------------------------------------------------------------------

const PANEL_ID = 'studio-control-panel';

/**
 * Actions that can affect bundle eligibility. If you add a new action that
 * modifies selectedItems, add its type here.
 */
const BUNDLE_AFFECTING_ACTIONS = new Set<BuilderAction['type']>([
	'TOGGLE_SERVICE',
	'SET_CONFIGURATION',
	'RESTORE_STATE',
]);

/**
 * Post-reducer pass that reconciles the studio-control-panel bundle:
 *
 * 1. Eligible + panel not selected → auto-add panel, record in bundleAdded
 * 2. Eligible + panel already selected manually → move to bundleAdded (lock it)
 * 3. Not eligible + panel in bundleAdded → remove panel, clear bundleAdded
 * 4. Not eligible + panel selected manually → leave it alone
 * 5. Panel removed by cascade → clean bundleAdded
 */
function reconcileBundling(catalog: ServiceItem[], state: BuilderState): BuilderState {
	const selectedArray = Object.values(state.selectedItems);
	const eligible = isBundleEligible(catalog, selectedArray);
	const panelSelected = PANEL_ID in state.selectedItems;
	const panelBundled = state.bundleAdded.includes(PANEL_ID);

	if (eligible) {
		if (!panelSelected) {
			// Case 1: auto-add panel
			const panelService = catalog.find((s) => s.id === PANEL_ID);
			if (!panelService || !panelService.active) return state;
			const panelItem = buildDefaultSelection(PANEL_ID, panelService.configurations);
			return {
				...state,
				selectedItems: { ...state.selectedItems, [PANEL_ID]: panelItem },
				bundleAdded: [...state.bundleAdded, PANEL_ID],
			};
		}
		if (panelSelected && !panelBundled) {
			// Case 2: was manually selected, now eligible → lock it
			return { ...state, bundleAdded: [...state.bundleAdded, PANEL_ID] };
		}
		// Already bundled → no change
		return state;
	}

	// Not eligible
	if (panelBundled) {
		if (panelSelected) {
			// Case 3: remove the auto-added panel
			const { [PANEL_ID]: _, ...rest } = state.selectedItems;
			const newAutoAdded = { ...state.autoAdded };
			delete newAutoAdded[PANEL_ID];
			return {
				...state,
				selectedItems: rest,
				autoAdded: newAutoAdded,
				bundleAdded: state.bundleAdded.filter((id) => id !== PANEL_ID),
			};
		}
		// Case 5: panel already removed by cascade, just clean bundleAdded
		return { ...state, bundleAdded: state.bundleAdded.filter((id) => id !== PANEL_ID) };
	}

	// Case 4: not eligible, panel not bundled → leave alone
	return state;
}

/**
 * Factory that creates the full reducer with bundle reconciliation.
 * Wraps the base reducer and runs reconcileBundling after bundle-affecting actions.
 */
export function createBuilderReducer(catalog: ServiceItem[]) {
	const baseReducer = builderReducer(catalog);
	return function wrappedReducer(state: BuilderState, action: BuilderAction): BuilderState {
		const next = baseReducer(state, action);
		if (BUNDLE_AFFECTING_ACTIONS.has(action.type)) {
			return reconcileBundling(catalog, next);
		}
		return next;
	};
}
