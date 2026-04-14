import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'MiB Social Manager — Made in Bugs',
};

export default function MibSocialManagerPage() {
	return (
		<main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
			<div className="max-w-sm w-full text-center space-y-8">
				<h1 className="text-3xl font-bold text-neutral-800">MiB Social Manager</h1>

				<div className="flex flex-col gap-3">
					<Link
						href="/privacy"
						className="block w-full py-3 px-6 rounded-lg bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="block w-full py-3 px-6 rounded-lg bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors"
					>
						Terms of Service
					</Link>
				</div>
			</div>
		</main>
	);
}
