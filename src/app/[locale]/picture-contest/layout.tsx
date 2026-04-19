import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import PictureContestLayoutClient from '@/components/picture-contest/PictureContestLayoutClient';

const VALID_LOCALES = new Set(['en', 'pt-BR']);

export const metadata = {
	title: 'Photo Contest — Made in Bugs',
	description: 'Photo contest gallery',
};

export default async function PictureContestLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Redirect invalid locales to pt-BR, preserving the rest of the path
	if (!VALID_LOCALES.has(locale)) {
		const headersList = await headers();
		const fullUrl = headersList.get('x-next-url') || headersList.get('x-invoke-path') || '';
		// Fallback: replace the locale segment in the URL
		const redirectPath = fullUrl
			? fullUrl.replace(`/${locale}/`, '/pt-BR/')
			: `/pt-BR/picture-contest`;
		redirect(redirectPath);
	}

	return (
		<PictureContestLayoutClient locale={locale}>
			{children}
		</PictureContestLayoutClient>
	);
}
