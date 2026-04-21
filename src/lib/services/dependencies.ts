import type { ServiceItem } from './types';

/**
 * Resolve all transitive dependencies for a service, including
 * configuration-driven additionalRequires.
 */
export function resolveDependencies(
	catalog: ServiceItem[],
	serviceId: string,
	selectedOptionIds: Record<string, string[]>
): string[] {
	const resolved = new Set<string>();
	const queue = [serviceId];

	while (queue.length > 0) {
		const current = queue.shift()!;
		if (resolved.has(current)) continue;
		resolved.add(current);

		const service = catalog.find((s) => s.id === current);
		if (!service) continue;

		// Direct requires
		if (service.requires) {
			for (const dep of service.requires) {
				if (!resolved.has(dep)) queue.push(dep);
			}
		}

		// Configuration-driven additionalRequires
		if (service.configurations) {
			for (const config of service.configurations) {
				const optionIds = selectedOptionIds[config.id] || [];
				for (const optionId of optionIds) {
					const option = config.options.find((o) => o.id === optionId);
					if (option?.additionalRequires) {
						for (const dep of option.additionalRequires) {
							if (!resolved.has(dep)) queue.push(dep);
						}
					}
				}
			}
		}
	}

	return Array.from(resolved);
}

/**
 * Find all currently-selected services that depend on the given service.
 */
export function findDependents(
	catalog: ServiceItem[],
	serviceId: string,
	currentlySelected: Set<string>
): string[] {
	const dependents: string[] = [];

	for (const selectedId of currentlySelected) {
		if (selectedId === serviceId) continue;

		const service = catalog.find((s) => s.id === selectedId);
		if (!service) continue;

		// Check direct requires
		if (service.requires?.includes(serviceId)) {
			dependents.push(selectedId);
			continue;
		}

		// Check configuration-driven additionalRequires
		if (service.configurations) {
			let found = false;
			for (const config of service.configurations) {
				for (const option of config.options) {
					if (option.additionalRequires?.includes(serviceId)) {
						// Only count if this option is plausibly selected
						// (the reducer handles actual selected state)
						dependents.push(selectedId);
						found = true;
						break;
					}
				}
				if (found) break;
			}
		}
	}

	return dependents;
}

/**
 * Check for conflicts among a set of service IDs.
 */
export function hasConflicts(
	catalog: ServiceItem[],
	serviceIds: Set<string>
): { serviceId: string; conflictsWith: string[] }[] {
	const conflicts: { serviceId: string; conflictsWith: string[] }[] = [];

	for (const id of serviceIds) {
		const service = catalog.find((s) => s.id === id);
		if (!service?.conflictsWith) continue;

		const activeConflicts = service.conflictsWith.filter((cid) => serviceIds.has(cid));
		if (activeConflicts.length > 0) {
			conflicts.push({ serviceId: id, conflictsWith: activeConflicts });
		}
	}

	return conflicts;
}

/**
 * Detect dependency cycles in the catalog.
 * Returns array of cycles found; empty if none.
 */
export function detectCycles(catalog: ServiceItem[]): string[][] {
	const cycles: string[][] = [];
	const visited = new Set<string>();
	const inStack = new Set<string>();
	const path: string[] = [];

	function dfs(serviceId: string) {
		if (inStack.has(serviceId)) {
			// Found a cycle: extract it from the path
			const cycleStart = path.indexOf(serviceId);
			if (cycleStart !== -1) {
				cycles.push([...path.slice(cycleStart), serviceId]);
			}
			return;
		}

		if (visited.has(serviceId)) return;

		visited.add(serviceId);
		inStack.add(serviceId);
		path.push(serviceId);

		const service = catalog.find((s) => s.id === serviceId);
		if (service?.requires) {
			for (const dep of service.requires) {
				dfs(dep);
			}
		}

		// Also check additionalRequires from all configuration options
		if (service?.configurations) {
			for (const config of service.configurations) {
				for (const option of config.options) {
					if (option.additionalRequires) {
						for (const dep of option.additionalRequires) {
							dfs(dep);
						}
					}
				}
			}
		}

		path.pop();
		inStack.delete(serviceId);
	}

	for (const service of catalog) {
		dfs(service.id);
	}

	return cycles;
}
