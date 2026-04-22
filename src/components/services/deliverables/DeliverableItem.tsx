'use client';

import type { ClientDeliverable, Locale } from '../../../lib/services/types';
import DeliverableTypeIcon from './DeliverableTypeIcon';

interface DeliverableItemProps {
	deliverable: ClientDeliverable;
	locale: Locale;
}

export default function DeliverableItem({ deliverable, locale }: DeliverableItemProps) {
	const statusLabel = deliverable.required
		? locale === 'en' ? 'required' : 'obrigatório'
		: locale === 'en' ? 'optional' : 'opcional';

	const statusColor = deliverable.required
		? 'text-orange-700'
		: 'text-green-700';

	return (
		<li className="flex items-start gap-2 text-sm">
			<DeliverableTypeIcon type={deliverable.type} />
			<div className="flex-1 min-w-0">
				<div className="text-neutral-700">
					<span>{deliverable.label[locale]}</span>
					<span className={`ml-1.5 text-xs font-medium ${statusColor}`}>
						({statusLabel})
					</span>
				</div>
				{deliverable.description && (
					<p className="text-xs text-neutral-500 mt-0.5">
						{deliverable.description[locale]}
					</p>
				)}
			</div>
		</li>
	);
}
