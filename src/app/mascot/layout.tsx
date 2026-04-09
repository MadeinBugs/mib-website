import { createClient } from '@/lib/supabase/server';
import '../globals.css';
import MascotLayoutClient from '@/components/mascot/MascotLayoutClient';

export const metadata = {
	title: 'Sisyphus Studio — Made in Bugs',
	description: 'Customize your own Sisyphus mascot',
};

export default async function MascotLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	let displayName: string | null = null;
	if (user) {
		const { data: profile } = await supabase
			.from('profiles')
			.select('display_name')
			.eq('id', user.id)
			.single();
		displayName = profile?.display_name ?? user.email ?? null;
	}

	return (
		<MascotLayoutClient isLoggedIn={!!user} displayName={displayName}>
			{children}
		</MascotLayoutClient>
	);
}
