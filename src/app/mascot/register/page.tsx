'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useMascotLocale } from '@/components/mascot/MascotLocaleContext';

export default function RegisterPage() {
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [inviteCode, setInviteCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { t } = useMascotLocale();

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
				const data = await validateRes.json().catch(() => ({}));
				setError(data.error || t.invalidInviteCode);
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
				const data = await consumeRes.json().catch(() => ({}));
				setError(data.error || t.registrationFailed);
				setLoading(false);
				return;
			}

			router.push('/mascot');
			router.refresh();
		} catch (err) {
			console.error('Registration error:', err);
			setError(t.unexpectedError);
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white rounded-crayon border-2 border-amber-300 shadow-xl p-8">
				<h2 className="font-h2 text-2xl font-bold text-center text-neutral-800 mb-2">
					{t.registerTitle}
				</h2>
				<p className="text-center text-neutral-500 font-body mb-8">
					{t.registerSubtitle}
				</p>

				<form onSubmit={handleRegister} className="space-y-5">
					<div>
						<label htmlFor="inviteCode" className="block text-sm font-semibold text-neutral-700 mb-1">
							{t.inviteCodeLabel}
						</label>
						<input
							id="inviteCode"
							type="text"
							required
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body font-mono tracking-wider"
							placeholder={t.inviteCodePlaceholder}
						/>
					</div>

					<div>
						<label htmlFor="displayName" className="block text-sm font-semibold text-neutral-700 mb-1">
							{t.displayNameLabel}
						</label>
						<input
							id="displayName"
							type="text"
							required
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder={t.displayNamePlaceholder}
						/>
					</div>

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
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors font-body"
							placeholder={t.passwordMinLength}
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
						{loading ? t.creatingAccount : t.createAccount}
					</button>
				</form>

				<p className="text-center text-sm text-neutral-500 mt-6 font-body">
					{t.hasAccount}{' '}
					<a href="/mascot/login" className="text-primary-500 hover:text-primary-600 font-semibold">
						{t.signInLink}
					</a>
				</p>
			</div>
		</div>
	);
}
