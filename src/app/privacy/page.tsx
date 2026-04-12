import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Privacy Policy — Made in Bugs',
};

export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-white py-16 px-6">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-neutral-800 mb-2">Privacy Policy</h1>
				<p className="text-sm text-neutral-500 mb-10">Last updated: April 10th 2026</p>

				<div className="space-y-6 text-neutral-700 leading-relaxed">
					<p>
						This application is an internal tool used by Made in Bugs for social
						media management purposes.
					</p>
					<p>
						We do not collect, store, or share any personal data from third-party
						users. This app only accesses our own accounts.
					</p>
					<p>
						Contact:{' '}
						<a
							href="mailto:andress@madeinbugs.com.br"
							className="text-blue-600 hover:underline"
						>
							andress@madeinbugs.com.br
						</a>
					</p>
				</div>
			</div>
		</main>
	);
}
