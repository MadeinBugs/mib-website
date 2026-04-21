'use client';

import type { DeliverableType } from '../../../lib/services/types';
import { FaGlobe, FaLock, FaKey, FaLaptop, FaCheckCircle, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface DeliverableTypeIconProps {
	type: DeliverableType;
}

const ICONS: Record<DeliverableType, { Icon: IconType; label: string }> = {
	domain: { Icon: FaGlobe, label: 'Domain' },
	'account-access': { Icon: FaLock, label: 'Account Access' },
	'api-key': { Icon: FaKey, label: 'API Key' },
	credentials: { Icon: FaLaptop, label: 'Credentials' },
	decision: { Icon: FaCheckCircle, label: 'Decision' },
	'payment-method': { Icon: FaCreditCard, label: 'Payment Method' },
	other: { Icon: FaInfoCircle, label: 'Other' },
};

export default function DeliverableTypeIcon({ type }: DeliverableTypeIconProps) {
	const entry = ICONS[type] ?? ICONS.other;
	return (
		<span className="shrink-0" aria-label={entry.label} title={entry.label}>
			<entry.Icon className="text-neutral-500" />
		</span>
	);
}
