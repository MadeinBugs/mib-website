import type { ServiceItem, SelectedServiceItem } from './types';

/**
 * Check whether the bundle eligibility conditions are met:
 *   - cloud-server is selected
 *   - At least one OTHER self-hosted service is selected
 *
 * This does NOT require studio-control-panel to already be selected —
 * the reconciler uses this to decide whether to auto-add it.
 *
 * A service is considered "self-hosted" if:
 *   - It hard-requires cloud-server, OR
 *   - It has a 'hosting-choice' configuration with 'self-hosted' option selected
 */
export function isBundleEligible(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[]
): boolean {
	const selectedIds = new Set(selectedItems.map((i) => i.serviceId));

	if (!selectedIds.has('cloud-server')) return false;

	for (const item of selectedItems) {
		if (item.serviceId === 'studio-control-panel') continue;
		if (item.serviceId === 'cloud-server') continue;

		const service = catalog.find((s) => s.id === item.serviceId);
		if (!service) continue;

		// Hard-requires cloud-server → inherently self-hosted
		if (service.requires?.includes('cloud-server')) return true;

		// Has hosting-choice config with self-hosted selected
		const hostingConfig = item.configurations.find(
			(c) => c.configurationId === 'hosting-choice'
		);
		if (hostingConfig?.selectedOptionIds.includes('self-hosted')) return true;
	}

	return false;
}

/**
 * Convenience wrapper: panel is bundled when it is selected AND eligible.
 * Used by pricing and UI to check the active bundled state.
 */
export function isStudioControlPanelBundled(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[]
): boolean {
	const hasPanel = selectedItems.some((i) => i.serviceId === 'studio-control-panel');
	return hasPanel && isBundleEligible(catalog, selectedItems);
}
