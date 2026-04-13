'use client';

import { useState, useRef } from 'react';

interface NewsletterStrings {
	placeholder: string;
	submit: string;
	submitting: string;
	invalidEmail: string;
	error: string;
}

interface NewsletterFormProps {
	locale: string;
	t: NewsletterStrings;
	onSuccess: (email: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ locale, t, onSuccess }: NewsletterFormProps) {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
	const [errorMsg, setErrorMsg] = useState('');
	const honeypotRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrorMsg('');

		const trimmed = email.trim();
		if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
			setErrorMsg(t.invalidEmail);
			return;
		}

		setStatus('loading');

		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: trimmed,
					locale,
					honeypot: honeypotRef.current?.value || '',
				}),
			});

			if (!res.ok && res.status === 429) {
				setErrorMsg(t.error);
				setStatus('error');
				return;
			}

			// Always treat as success (server returns 200 even for duplicates)
			onSuccess(trimmed);
		} catch {
			setErrorMsg(t.error);
			setStatus('error');
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<input
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (errorMsg) setErrorMsg('');
						}}
						placeholder={t.placeholder}
						className={`w-full px-4 py-3 rounded-lg border-2 font-body text-sm
							focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors
							${errorMsg
								? 'border-red-400 bg-red-50'
								: 'border-amber-300 bg-white'
							}`}
						disabled={status === 'loading'}
						autoComplete="email"
						aria-label="Email"
					/>
					{/* Honeypot — invisible to humans, fillable by bots */}
					<input
						ref={honeypotRef}
						type="text"
						name="website_url"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						style={{
							position: 'absolute',
							left: '-9999px',
							opacity: 0,
							height: 0,
							width: 0,
							overflow: 'hidden',
						}}
					/>
				</div>
				<button
					type="submit"
					disabled={status === 'loading'}
					className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300
						text-white font-bold text-sm rounded-lg transition-all duration-200
						hover:scale-105 active:scale-95 disabled:hover:scale-100
						shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
				>
					{status === 'loading' ? (
						<>
							<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							{t.submitting}
						</>
					) : (
						t.submit
					)}
				</button>
			</div>
			{errorMsg && (
				<p className="mt-2 text-sm text-red-600 font-body">{errorMsg}</p>
			)}
		</form>
	);
}
