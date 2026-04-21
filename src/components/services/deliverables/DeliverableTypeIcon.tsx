'use client';

import type { DeliverableType } from '../../../lib/services/types';

interface DeliverableTypeIconProps {
	type: DeliverableType;
}

const ICONS: Record<DeliverableType, { icon: string; label: string }> = {
	domain: { icon: '🌐', label: 'Domain' },
	'account-access': { icon: '🔒', label: 'Account Access' },
	'api-key': { icon: '🔑', label: 'API Key' },
	credentials: { icon: '💻', label: 'Credentials' },
	decision: { icon: '✅', label: 'Decision' },
	'payment-method': { icon: '💳', label: 'Payment Method' },
	other: { icon: 'ℹ️', label: 'Other' },
};

export default function DeliverableTypeIcon({ type }: DeliverableTypeIconProps) {
	const entry = ICONS[type] ?? ICONS.other;
	return (
		<span className="shrink-0" aria-label={entry.label} title={entry.label}>
			{entry.icon}
		</span>
	);
}
