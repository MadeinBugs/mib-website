import Link from 'next/link';
import type { Translations } from '../../lib/i18n';
import type { LegalPageContent } from '../../lib/legal/types';
import ContentLayout from '../ContentLayout';

interface LegalPageProps {
	translations: Translations;
	locale: string;
	content: LegalPageContent;
	backHref: string;
	backLabel: string;
}

export default function LegalPage({ translations, locale, content, backHref, backLabel }: LegalPageProps) {
	const localeKey = locale as 'en' | 'pt-BR';
	const page = content[localeKey];

	return (
		<ContentLayout translations={translations} locale={locale}>
			<main className="min-h-screen py-16 px-6">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						{page.title}
					</h1>
					<p className="text-sm text-neutral-500 mb-10">{page.lastUpdated}</p>

					<div className={page.sections.some(s => s.title) ? 'space-y-8' : 'space-y-6'}>
						{page.sections.map((section, i) => (
							<section key={i} className="text-neutral-700 leading-relaxed">
								{section.title && (
									<h2 className="text-xl font-semibold text-neutral-800 mb-3">
										{section.title}
									</h2>
								)}
								{section.content}
							</section>
						))}
					</div>

					<div className="mt-12 pt-6 border-t border-neutral-200">
						<Link href={backHref} className="text-sm text-neutral-500 hover:text-amber-700 transition-colors">
							{backLabel}
						</Link>
					</div>
				</div>
			</main>
		</ContentLayout>
	);
}
