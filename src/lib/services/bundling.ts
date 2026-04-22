import type { ServiceItem, SelectedServiceItem } from './types';

/**
 * Business rule: Studio Control Panel is bundled free when:
 *   - It is selected
 *   - cloud-server is selected
 *   - At least one OTHER self-hosted service is selected
 *
 * A service is considered "self-hosted" if:
 *   - It hard-requires cloud-server, OR
 *   - It has a 'hosting-choice' configuration with 'self-hosted' option selected
 */
export function isStudioControlPanelBundled(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[]
): boolean {
	const selectedIds = new Set(selectedItems.map((i) => i.serviceId));

	if (!selectedIds.has('studio-control-panel')) return false;
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
