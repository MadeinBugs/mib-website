'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import type {
	ServiceItem,
	SelectedServiceItem,
	ClientDeliverable,
	Locale,
} from '../../../lib/services/types';
import DeliverableItem from './DeliverableItem';

interface ClientDeliverablesPanelProps {
	catalog: ServiceItem[];
	selectedItems: SelectedServiceItem[];
	locale: Locale;
}

/**
 * Collect deliverables for a single service, including option-level ones
 * from currently-selected configuration options.
 */
function collectDeliverablesForItem(
	service: ServiceItem,
	item: SelectedServiceItem
): ClientDeliverable[] {
	const map = new Map<string, ClientDeliverable>();

	for (const d of service.clientDeliverables) {
		if (!map.has(d.id)) map.set(d.id, d);
	}

	if (service.configurations) {
		for (const selConfig of item.configurations) {
			const config = service.configurations.find((c) => c.id === selConfig.configurationId);
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

export default function ClientDeliverablesPanel({
	catalog,
	selectedItems,
	locale,
}: ClientDeliverablesPanelProps) {
	const servicesWithDeliverables = selectedItems
		.map((item) => {
			const service = catalog.find((s) => s.id === item.serviceId);
			if (!service) return null;
			const deliverables = collectDeliverablesForItem(service, item);
			if (deliverables.length === 0) return null;
			return { service, deliverables };
		})
		.filter((entry): entry is { service: ServiceItem; deliverables: ClientDeliverable[] } => entry !== null);

	// All services default to expanded; state tracks collapsed IDs
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

	if (servicesWithDeliverables.length === 0) return null;

	const toggle = (serviceId: string) => {
		const next = new Set(collapsed);
		if (next.has(serviceId)) {
			next.delete(serviceId);
		} else {
			next.add(serviceId);
		}
		setCollapsed(next);
	};

	return (
		<div className="rounded-xl border border-service-border bg-service-bg-elevated p-5 space-y-4">
			<div className="space-y-1">
				<h2 className="font-bold text-service-text-primary">
					{locale === 'en' ? 'Client Deliverables' : 'Entregáveis do Cliente'}
				</h2>
				<p className="text-xs text-service-text-secondary">
					{locale === 'en'
						? "Things you'll need to provide us to complete these services."
						: 'Coisas que você precisará nos fornecer para completar estes serviços.'}
				</p>
			</div>

			<div className="space-y-3">
				{servicesWithDeliverables.map(({ service, deliverables }) => {
					const isCollapsed = collapsed.has(service.id);
					const requiredCount = deliverables.filter((d) => d.required).length;
					const optionalCount = deliverables.length - requiredCount;

					return (
						<div key={service.id} className="border border-service-border rounded-lg overflow-hidden">
							<button
								type="button"
								onClick={() => toggle(service.id)}
								className="w-full flex items-center justify-between px-4 py-3 bg-service-bg-strong hover:bg-service-bg-strong/80 transition-colors text-left"
							>
								<div className="flex items-center gap-2 min-w-0">
									<FaChevronDown
										className={`shrink-0 text-xs text-service-text-tertiary transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'
											}`}
									/>
									<span className="font-medium text-sm text-service-text-primary truncate">
										{service.name[locale]}
									</span>
								</div>
								<div className="shrink-0 flex items-center gap-1.5 text-xs">
									{requiredCount > 0 && (
										<span className="px-2 py-0.5 rounded-full bg-orange-900/30 text-orange-400 font-medium">
											{requiredCount} {locale === 'en' ? 'required' : 'obrigatório'}
										</span>
									)}
									{optionalCount > 0 && (
										<span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 font-medium">
											{optionalCount} {locale === 'en' ? 'optional' : 'opcional'}
										</span>
									)}
								</div>
							</button>

							{!isCollapsed && (
								<ul className="px-4 py-3 space-y-2 bg-service-bg-elevated">
									{deliverables.map((d) => (
										<DeliverableItem key={d.id} deliverable={d} locale={locale} />
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
