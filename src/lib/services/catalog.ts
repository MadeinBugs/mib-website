import type { ServiceItem } from './types';
import { infrastructureServices } from './categories/infrastructure';
import { cicdServices } from './categories/cicd';
import { automationServices } from './categories/automation';
import { crmServices } from './categories/crm';
import { marketingServices } from './categories/marketing';
import { analyticsServices } from './categories/analytics';
import { teamManagementServices } from './categories/team-management';
import { socialMediaServices } from './categories/social-media';
import { webGamedevServices } from './categories/web-gamedev';

export const SERVICE_CATALOG: ServiceItem[] = [
	...infrastructureServices,
	...cicdServices,
	...automationServices,
	...crmServices,
	...marketingServices,
	...analyticsServices,
	...teamManagementServices,
	...socialMediaServices,
	...webGamedevServices,
];

export function getServiceById(id: string): ServiceItem | undefined {
	return SERVICE_CATALOG.find((s) => s.id === id);
}

export function getActiveServices(): ServiceItem[] {
	return SERVICE_CATALOG.filter((s) => s.active);
}

export function getServicesByCategory(category: string): ServiceItem[] {
	return SERVICE_CATALOG.filter((s) => s.category === category && s.active);
}
