import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import '@/app/[locale]/services/services-theme.css';
import type { Metadata } from 'next';

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-services-sans',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Admin — Made in Bugs',
	robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		redirect('/mascot/login?next=/admin/quotes');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user.id)
		.single();

	if (!profile || profile.role !== 'admin') {
		return (
			<div
				className={`services-theme ${inter.variable} min-h-screen bg-service-bg flex items-center justify-center`}
				style={{ fontFamily: 'var(--font-services-sans), Inter, system-ui, sans-serif' }}
			>
				<div className="text-center max-w-md mx-auto p-8">
					<div className="text-5xl mb-6">🔒</div>
					<h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
					<p className="text-neutral-400 mb-6">
						Your account (<span className="text-neutral-300">{user.email}</span>) does not have admin privileges.
					</p>
					<Link href="/mascot" className="text-service-accent hover:underline text-sm">
						← Back to Mascot
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`services-theme ${inter.variable} min-h-screen bg-service-bg text-service-text-primary`}
			style={{ fontFamily: 'var(--font-services-sans), Inter, system-ui, sans-serif' }}
		>
			<header className="sticky top-0 z-50 bg-service-bg-elevated border-b border-service-border px-6 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<img src="/assets/logo_white.png" alt="Made in Bugs" className="h-7 w-auto" />
					<span className="text-white font-semibold text-sm">/admin</span>
					<span className="text-service-text-tertiary text-sm mx-1">·</span>
					<Link
						href="/admin/quotes"
						className="text-sm text-service-text-secondary hover:text-white transition-colors"
					>
						Quotes
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-xs text-service-text-tertiary hidden sm:block">{user.email}</span>
					<Link
						href="/mascot"
						className="text-xs text-service-text-tertiary hover:text-white transition-colors"
					>
						Exit admin →
					</Link>
				</div>
			</header>
			<main className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">{children}</main>
		</div>
	);
}
