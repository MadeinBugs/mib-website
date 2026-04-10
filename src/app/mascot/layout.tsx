import { createClient } from '@/lib/supabase/server';
import '../globals.css';
import MascotLayoutClient from '@/components/mascot/MascotLayoutClient';

// Homemade Apple font for the editor title
// eslint-disable-next-line @next/next/no-page-custom-font
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap';

export const metadata = {
	title: 'Mascot Customization — Made in Bugs',
	description: 'Customize your internal Sisyphus mascot',
};

export default async function MascotLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	let displayName: string | null = null;
	let userRole: string | null = null;
	if (user) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('display_name, role')
			.eq('id', user.id)
			.single();
		displayName = profile?.display_name ?? user.email ?? null;
		userRole = profile?.role ?? 'user';
	}

	return (
		<>
			{/* eslint-disable-next-line @next/next/no-page-custom-font */}
			<link rel="stylesheet" href={FONT_LINK} />
			<MascotLayoutClient isLoggedIn={!!user} displayName={displayName} userRole={userRole}>
				{children}
			</MascotLayoutClient>
		</>
	);
}
