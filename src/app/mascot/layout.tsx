import { createClient } from '@/lib/supabase/server';
import '../globals.css';

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
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
			{user && (
				<header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b-2 border-amber-200">
					<div className="flex items-center gap-3">
						<h2 className="font-logo text-lg text-neutral-800">
							Sisyphus Studio
						</h2>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm font-body text-neutral-600">
							{displayName}
						</span>
						<a
							href="/mascot/logout"
							className="text-sm font-body text-primary-500 hover:text-primary-600 font-semibold transition-colors"
						>
							Sign out
						</a>
					</div>
				</header>
			)}
			<main>{children}</main>
		</div>
	);
}
