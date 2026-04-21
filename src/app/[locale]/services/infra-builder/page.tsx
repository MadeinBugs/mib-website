import { normalizeLocale } from '@/lib/i18n';
import { getActiveServices } from '@/lib/services/catalog';
import type { Locale } from '@/lib/services/types';
import Link from 'next/link';
import InfraBuilderClient from './InfraBuilderClient';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function InfraBuilderPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);
	const isLive = process.env.SERVICES_FEATURE_LIVE === 'true';

	if (!isLive) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
				<div className="max-w-lg text-center">
					<h1 className="text-4xl font-bold text-neutral-800 mb-4">
						{locale === 'pt-BR' ? 'Em breve' : 'Coming Soon'}
					</h1>
					<p className="text-lg text-neutral-600 mb-8">
						{locale === 'pt-BR'
							? 'O builder de infraestrutura está sendo preparado. Volte em breve!'
							: 'The infrastructure builder is being prepared. Check back soon!'}
					</p>
					<Link
						href={`/${locale}/services`}
						className="inline-block px-6 py-3 bg-[#04c597] text-white font-semibold rounded-lg hover:bg-[#036b54] transition-colors"
					>
						{locale === 'pt-BR' ? '← Voltar aos serviços' : '← Back to services'}
					</Link>
				</div>
			</div>
		);
	}

	const catalog = getActiveServices();

	return <InfraBuilderClient locale={locale as Locale} catalog={catalog} />;
}
