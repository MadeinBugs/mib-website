import Link from 'next/link';
import type { Locale } from '@/lib/services/types';

interface ServicesFooterProps {
	locale: Locale;
}

export default function ServicesFooter({ locale }: ServicesFooterProps) {
	return (
		<footer className="border-t border-service-border bg-service-bg mt-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-service-text-tertiary">
				<div className="flex items-center gap-4">
					<span>&copy; {new Date().getFullYear()} Made in Bugs</span>
					<Link href={`/${locale}/terms/services`} className="hover:text-service-text-secondary transition-colors">
						{locale === 'en' ? 'Terms' : 'Termos'}
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<a href="mailto:andress@madeinbugs.com.br" className="hover:text-service-text-secondary transition-colors">
						andress@madeinbugs.com.br
					</a>
				</div>
			</div>
		</footer>
	);
}
