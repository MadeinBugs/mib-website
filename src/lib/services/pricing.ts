import type {
	ServiceItem,
	SelectedServiceItem,
	Currency,
	ClientDeliverable,
	ThirdPartyCost,
	Price,
} from './types';

function findService(catalog: ServiceItem[], serviceId: string): ServiceItem | null {
	const service = catalog.find((s) => s.id === serviceId);
	if (!service) {
		console.warn(`[pricing] Service "${serviceId}" not found in catalog, skipping.`);
		return null;
	}
	return service;
}

function getOptionModifiers(
	service: ServiceItem,
	selected: SelectedServiceItem,
	currency: Currency
): number {
	let total = 0;
	for (const selConfig of selected.configurations) {
		const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
		if (!config) continue;
		for (const optionId of selConfig.selectedOptionIds) {
			const option = config.options.find((o) => o.id === optionId);
			if (!option) continue;
			total += option.priceModifier[currency];
		}
	}
	return total;
}

function getMaintenanceModifiers(
	service: ServiceItem,
	selected: SelectedServiceItem,
	currency: Currency
): number {
	let total = 0;
	for (const selConfig of selected.configurations) {
		const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
		if (!config) continue;
		for (const optionId of selConfig.selectedOptionIds) {
			const option = config.options.find((o) => o.id === optionId);
			if (!option?.maintenanceModifier) continue;
			total += option.maintenanceModifier[currency];
		}
	}
	return total;
}

export function computeSetupPrice(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[],
	currency: Currency,
	bundleAdded: string[] = []
): number {
	let total = 0;
	for (const selected of selectedItems) {
		const service = findService(catalog, selected.serviceId);
		if (!service) continue;
		total += service.basePrice[currency];
		total += getOptionModifiers(service, selected, currency);
	}

	// Bundle discount: zero out bundled services
	for (const bundledId of bundleAdded) {
		const service = catalog.find((s) => s.id === bundledId);
		if (service && selectedItems.some((i) => i.serviceId === bundledId)) {
			total -= service.basePrice[currency];
		}
	}

	return total;
}

export function computeMaintenanceMonthly(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[],
	currency: Currency,
	bundleAdded: string[] = []
): number {
	let total = 0;
	for (const selected of selectedItems) {
		const service = findService(catalog, selected.serviceId);
		if (!service || !service.maintenance) continue;
		total += service.maintenance.price[currency];
		total += getMaintenanceModifiers(service, selected, currency);
	}

	// Bundle discount: zero out bundled service maintenance
	for (const bundledId of bundleAdded) {
		const service = catalog.find((s) => s.id === bundledId);
		if (service?.maintenance && selectedItems.some((i) => i.serviceId === bundledId)) {
			total -= service.maintenance.price[currency];
		}
	}

	return total;
}

export function computeGrandTotal(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[],
	currency: Currency,
	maintenanceMonths: 0 | 3 | 6 | 12,
	bundleAdded: string[] = []
): { setup: number; maintenanceMonthly: number; maintenanceTotal: number; grandTotal: number } {
	const setup = computeSetupPrice(catalog, selectedItems, currency, bundleAdded);
	const maintenanceMonthly = maintenanceMonths > 0
		? computeMaintenanceMonthly(catalog, selectedItems, currency, bundleAdded)
		: 0;
	const maintenanceTotal = maintenanceMonthly * maintenanceMonths;
	return {
		setup,
		maintenanceMonthly,
		maintenanceTotal,
		grandTotal: setup + maintenanceTotal,
	};
}

export function countPendingItems(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[]
): { hasPending: boolean; count: number } {
	let count = 0;
	for (const selected of selectedItems) {
		const service = findService(catalog, selected.serviceId);
		if (!service) continue;
		for (const cf of selected.customFields) {
			const fieldDef = service.customFields?.find((f) => f.id === cf.customFieldId);
			if (!fieldDef?.pendingPricing) continue;
			// Count non-empty values
			const nonEmpty = cf.values.filter((v) => v.trim().length > 0);
			count += nonEmpty.length;
		}
	}
	return { hasPending: count > 0, count };
}

export function collectDeliverables(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[]
): ClientDeliverable[] {
	const map = new Map<string, ClientDeliverable>();

	for (const selected of selectedItems) {
		const service = findService(catalog, selected.serviceId);
		if (!service) continue;

		// Service-level deliverables
		for (const d of service.clientDeliverables) {
			if (!map.has(d.id)) map.set(d.id, d);
		}

		// Configuration option deliverables
		for (const selConfig of selected.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) continue;
			for (const optionId of selConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (!option?.additionalDeliverables) continue;
				for (const d of option.additionalDeliverables) {
					if (!map.has(d.id)) map.set(d.id, d);
				}
			}
		}
	}

	return Array.from(map.values());
}

export function collectThirdPartyCosts(
	catalog: ServiceItem[],
	selectedItems: SelectedServiceItem[],
	currency: Currency
): ThirdPartyCost[] {
	const map = new Map<string, ThirdPartyCost>();

	for (const selected of selectedItems) {
		const service = findService(catalog, selected.serviceId);
		if (!service) continue;

		// Service-level third-party costs
		if (service.thirdPartyCosts) {
			for (const cost of service.thirdPartyCosts) {
				if (!map.has(cost.id)) map.set(cost.id, cost);
			}
		}

		// Configuration option third-party costs
		for (const selConfig of selected.configurations) {
			const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
			if (!config) continue;
			for (const optionId of selConfig.selectedOptionIds) {
				const option = config.options.find((o) => o.id === optionId);
				if (!option?.thirdPartyCosts) continue;
				for (const cost of option.thirdPartyCosts) {
					if (!map.has(cost.id)) map.set(cost.id, cost);
				}
			}
		}
	}

	return Array.from(map.values());
}

export function computeMaintenanceForService(
	service: ServiceItem,
	selected: SelectedServiceItem,
	currency: Currency
): { base: Price; modifiers: Array<{ optionId: string; amount: Price }>; total: number } | null {
	if (!service.maintenance) return null;

	const base = service.maintenance.price;
	const modifiers: Array<{ optionId: string; amount: Price }> = [];

	for (const selConfig of selected.configurations) {
		const config = service.configurations?.find((c) => c.id === selConfig.configurationId);
		if (!config) continue;
		for (const optionId of selConfig.selectedOptionIds) {
			const option = config.options.find((o) => o.id === optionId);
			if (!option?.maintenanceModifier) continue;
			modifiers.push({ optionId, amount: option.maintenanceModifier });
		}
	}

	const total = base[currency] + modifiers.reduce((sum, m) => sum + m.amount[currency], 0);
	return { base, modifiers, total };
}
