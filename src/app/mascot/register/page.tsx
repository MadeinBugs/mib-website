'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [inviteCode, setInviteCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			// Validate invite code server-side
			const validateRes = await fetch('/mascot/api/validate-invite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: inviteCode }),
			});

			if (!validateRes.ok) {
				const data = await validateRes.json();
				setError(data.error || 'Invalid invite code');
				setLoading(false);
				return;
			}

			const { inviteCodeId } = await validateRes.json();

			// Create the user via Supabase Auth
			const supabase = createClient();
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						display_name: displayName,
						invite_code_id: inviteCodeId,
					},
				},
			});

			if (authError) {
				setError(authError.message);
				setLoading(false);
				return;
			}

			// Consume the invite code and create profile server-side
			const consumeRes = await fetch('/mascot/api/consume-invite', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					inviteCodeId,
					userId: authData.user?.id,
					displayName,
				}),
			});

			if (!consumeRes.ok) {
				const data = await consumeRes.json();
				setError(data.error || 'Registration failed');
				setLoading(false);
				return;
			}

			router.push('/mascot');
			router.refresh();
		} catch {
			setError('An unexpected error occurred');
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
			<div className="w-full max-w-md bg-white rounded-crayon border-2 border-amber-300 shadow-xl p-8">
				<h1 className="text-center mb-2" style={{ fontSize: '3rem' }}>
					Join the Team
				</h1>
				<p className="text-center text-neutral-500 font-body mb-8">
					Create your account with an invite code
				</p>

				<form onSubmit={handleRegister} className="space-y-5">
					<div>
						<label htmlFor="inviteCode" className="block text-sm font-semibold text-neutral-700 mb-1">
							Invite Code
						</label>
						<input
							id="inviteCode"
							type="text"
							required
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body font-mono tracking-wider"
							placeholder="XXXX-XXXX-XXXX"
						/>
					</div>

					<div>
						<label htmlFor="displayName" className="block text-sm font-semibold text-neutral-700 mb-1">
							Display Name
						</label>
						<input
							id="displayName"
							type="text"
							required
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder="Your name"
						/>
					</div>

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
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder="At least 6 characters"
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
						{loading ? 'Creating account...' : 'Create Account'}
					</button>
				</form>

				<p className="text-center text-sm text-neutral-500 mt-6 font-body">
					Already have an account?{' '}
					<a href="/mascot/login" className="text-primary-500 hover:text-primary-600 font-semibold">
						Sign in
					</a>
				</p>
			</div>
		</div>
	);
}
