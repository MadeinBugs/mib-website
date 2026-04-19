import PictureContestLayoutClient from '@/components/picture-contest/PictureContestLayoutClient';

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

	return (
		<PictureContestLayoutClient locale={locale}>
			{children}
		</PictureContestLayoutClient>
	);
}
