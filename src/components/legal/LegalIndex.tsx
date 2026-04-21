import Link from 'next/link';
import type { Translations } from '../../lib/i18n';
import type { LegalIndexContent } from '../../lib/legal/types';
import ContentLayout from '../ContentLayout';

interface LegalIndexProps {
	translations: Translations;
	locale: string;
	basePath: 'terms' | 'privacy';
	content: LegalIndexContent;
}

export default function LegalIndex({ translations, locale, basePath, content }: LegalIndexProps) {
	const localeKey = locale as 'en' | 'pt-BR';
	const page = content[localeKey];

	return (
		<ContentLayout translations={translations} locale={locale}>
			<main className="min-h-screen py-16 px-6">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						{page.title}
					</h1>
					<p className="text-neutral-600 mb-10">
						{page.subtitle}
					</p>

					<div className="space-y-4">
						{content.items.map((item) => {
							const localized = item[localeKey];
							return (
								<Link
									key={item.slug}
									href={`/${locale}/${basePath}/${item.slug}`}
									className="block p-6 rounded-lg border border-neutral-200 hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
								>
									<div className="flex items-start gap-4">
										<span className="group-hover:scale-110 transition-transform duration-200 text-neutral-600 group-hover:text-amber-600">
											{item.icon}
										</span>
										<div>
											<h2 className="text-lg font-semibold text-neutral-800 group-hover:text-amber-700 transition-colors">
												{localized.title}
											</h2>
											<p className="text-sm text-neutral-500 mt-1">
												{localized.description}
											</p>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
