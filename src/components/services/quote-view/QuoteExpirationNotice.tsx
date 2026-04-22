import Link from 'next/link';
import type { Locale } from '@/lib/services/types';
import { FaExclamationTriangle } from 'react-icons/fa';

interface QuoteExpirationNoticeProps {
	status: string;
	expiresAt: string;
	locale: Locale;
}

export default function QuoteExpirationNotice({ status, expiresAt, locale }: QuoteExpirationNoticeProps) {
	if (status === 'expired') {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
				<FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
				<div className="space-y-1">
					<p className="text-sm font-medium text-red-800">
						{locale === 'en' ? 'This quote has expired' : 'Este orçamento expirou'}
					</p>
					<p className="text-xs text-red-700">
						{locale === 'en'
							? 'Prices and availability may have changed. Build a new quote to get current pricing.'
							: 'Preços e disponibilidade podem ter mudado. Crie um novo orçamento para preços atualizados.'}
					</p>
					<Link
						href={`/${locale}/services/infra-builder`}
						className="inline-block mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
					>
						{locale === 'en' ? 'Build a new quote →' : 'Criar novo orçamento →'}
					</Link>
				</div>
			</div>
		);
	}

	if (status === 'new') {
		const expires = new Date(expiresAt);
		const now = new Date();
		const daysLeft = Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

		return (
			<p className="text-xs text-neutral-400">
				{locale === 'en'
					? `Valid for ${daysLeft} more day${daysLeft !== 1 ? 's' : ''}`
					: `Válido por mais ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`}
			</p>
		);
	}

	return null;
}
