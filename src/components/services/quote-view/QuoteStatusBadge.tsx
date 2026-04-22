import type { Locale } from '@/lib/services/types';

type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected' | 'expired';

const STATUS_CONFIG: Record<QuoteStatus, { color: string; en: string; 'pt-BR': string }> = {
	new: { color: 'bg-blue-100 text-blue-700', en: 'New', 'pt-BR': 'Novo' },
	contacted: { color: 'bg-amber-100 text-amber-700', en: 'Contacted', 'pt-BR': 'Contatado' },
	quoted: { color: 'bg-teal-100 text-teal-700', en: 'Quoted', 'pt-BR': 'Orçado' },
	accepted: { color: 'bg-green-100 text-green-700', en: 'Accepted', 'pt-BR': 'Aceito' },
	rejected: { color: 'bg-neutral-100 text-neutral-500', en: 'Declined', 'pt-BR': 'Recusado' },
	expired: { color: 'bg-red-100 text-red-700', en: 'Expired', 'pt-BR': 'Expirado' },
};

interface QuoteStatusBadgeProps {
	status: string;
	locale: Locale;
}

export default function QuoteStatusBadge({ status, locale }: QuoteStatusBadgeProps) {
	const config = STATUS_CONFIG[status as QuoteStatus] ?? STATUS_CONFIG.new;
	return (
		<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
			{config[locale]}
		</span>
	);
}
