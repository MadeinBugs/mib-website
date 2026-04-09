'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
			<div className="w-full max-w-md bg-white rounded-crayon border-2 border-amber-300 shadow-xl p-8">
				<h1 className="text-center mb-2" style={{ fontSize: '3rem' }}>
					Sisyphus Studio
				</h1>
				<p className="text-center text-neutral-500 font-body mb-8">
					Sign in to customize your mascot
				</p>

				<form onSubmit={handleLogin} className="space-y-5">
					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder="you@madeinbugs.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-1">
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder="••••••••"
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
						className="w-full btn-crayon disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				<p className="text-center text-sm text-neutral-500 mt-6 font-body">
					Don&apos;t have an account?{' '}
					<a href="/mascot/register" className="text-primary-500 hover:text-primary-600 font-semibold">
						Register with invite code
					</a>
				</p>
			</div>
		</div>
	);
}
