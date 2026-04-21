'use client';

import type { ClientDeliverable, Locale } from '../../../lib/services/types';
import DeliverableTypeIcon from './DeliverableTypeIcon';

interface DeliverableItemProps {
	deliverable: ClientDeliverable;
	locale: Locale;
}

export default function DeliverableItem({ deliverable, locale }: DeliverableItemProps) {
	return (
		<li className="flex items-start gap-2 text-sm">
			<DeliverableTypeIcon type={deliverable.type} />
			<div>
				<span className="text-neutral-700">{deliverable.label[locale]}</span>
				{deliverable.description && (
					<p className="text-xs text-neutral-500">{deliverable.description[locale]}</p>
				)}
			</div>
		</li>
	);
}
