import { createPictureContestClient } from '@/lib/supabase/picture-contest-server';
import PictureContestLayoutClient from '@/components/picture-contest/PictureContestLayoutClient';

export const metadata = {
	title: 'Photo Contest Gallery — Made in Bugs',
	description: 'Admin gallery for photo contest submissions',
};

export default async function PictureContestLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const supabase = await createPictureContestClient();
	const { data: { user } } = await supabase.auth.getUser();

	return (
		<PictureContestLayoutClient isLoggedIn={!!user} locale={locale}>
			{children}
		</PictureContestLayoutClient>
	);
}
