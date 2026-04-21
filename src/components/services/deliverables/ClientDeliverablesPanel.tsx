'use client';

import type { ClientDeliverable, Locale } from '../../../lib/services/types';
import DeliverableItem from './DeliverableItem';

interface ClientDeliverablesPanelProps {
	deliverables: ClientDeliverable[];
	locale: Locale;
}

export default function ClientDeliverablesPanel({ deliverables, locale }: ClientDeliverablesPanelProps) {
	if (deliverables.length === 0) return null;

	return (
		<div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
			<h2 className="font-bold text-neutral-800">
				{locale === 'en' ? "What You'll Receive" : 'O Que Você Receberá'}
			</h2>
			<ul className="space-y-2">
				{deliverables.map((d) => (
					<DeliverableItem key={d.id} deliverable={d} locale={locale} />
				))}
			</ul>
		</div>
	);
}
