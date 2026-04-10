'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useMascotLocale } from '@/components/mascot/MascotLocaleContext';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { t } = useMascotLocale();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push('/mascot');
		router.refresh();
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white rounded-crayon border-2 border-amber-300 shadow-xl p-8">
				<h2 className="font-h2 text-2xl font-bold text-center text-neutral-800 mb-2">
					{t.loginTitle}
				</h2>
				<p className="text-center text-neutral-500 font-body mb-8">
					{t.loginSubtitle}
				</p>

				<form onSubmit={handleLogin} className="space-y-5">
					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
							{t.emailLabel}
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder={t.emailPlaceholder}
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-1">
							{t.passwordLabel}
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder={t.passwordPlaceholder}
						/>
					</div>

					{error && (
						<p className="text-red-600 text-sm font-body bg-red-50 p-3 rounded-lg border border-red-200">
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
					>
						{loading ? t.signingIn : t.signIn}
					</button>
				</form>

				<p className="text-center text-sm text-neutral-500 mt-6 font-body">
					{t.noAccount}{' '}
					<a href="/mascot/register" className="text-primary-500 hover:text-primary-600 font-semibold">
						{t.registerLink}
					</a>
				</p>
			</div>
		</div>
	);
}
