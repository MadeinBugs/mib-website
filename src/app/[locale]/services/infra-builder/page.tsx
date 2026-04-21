import { normalizeLocale } from '@/lib/i18n';
import Link from 'next/link';

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

	// Placeholder for Phase 4 builder UI
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-neutral-800 mb-4">
					{locale === 'pt-BR' ? 'Infra Builder' : 'Infra Builder'}
				</h1>
				<p className="text-neutral-600">
					{locale === 'pt-BR'
						? 'A interface do builder será implementada na Fase 4.'
						: 'The builder interface will be implemented in Phase 4.'}
				</p>
				<Link
					href={`/${locale}/services`}
					className="inline-block mt-4 text-[#04c597] hover:underline"
				>
					{locale === 'pt-BR' ? '← Voltar aos serviços' : '← Back to services'}
				</Link>
			</div>
		</div>
	);
}
