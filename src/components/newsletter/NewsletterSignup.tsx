'use client';

import { useState, useRef } from 'react';

interface NewsletterSignupProps {
	locale: string;
	className?: string;
	inputPlaceholder?: string;
	buttonText?: string;
	accentColor?: string;
}

const EMAIL_REGEX = /.+@.+\..{2,}/;

const strings = {
	en: {
		placeholder: 'your@email.com',
		submit: 'Subscribe',
		submitting: 'Subscribing...',
		invalidEmail: 'Please enter a valid email address.',
		error: 'Something went wrong. Please try again.',
		rateLimit: 'Too many attempts. Please try again in a few minutes.',
		success: "You're in! Check your inbox 📬",
	},
	'pt-BR': {
		placeholder: 'seu@email.com',
		submit: 'Inscrever-se',
		submitting: 'Inscrevendo...',
		invalidEmail: 'Por favor, insira um email válido.',
		error: 'Algo deu errado. Tente novamente.',
		rateLimit: 'Muitas tentativas. Tente novamente em alguns minutos.',
		success: 'Deu certo! Verifique sua caixa de entrada 📬',
	},
};

export default function NewsletterSignup({
	locale,
	className,
	inputPlaceholder,
	buttonText,
	accentColor,
}: NewsletterSignupProps) {
	const t = strings[locale as 'en' | 'pt-BR'] || strings.en;

	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
					company: honeypotRef.current?.value || '',
				}),
			});

			if (res.status === 429) {
				setErrorMsg(t.rateLimit);
				setStatus('error');
				return;
			}

			// Always treat as success (server returns 200 even for duplicates)
			setStatus('success');

			// Track newsletter subscription
			if (typeof window !== 'undefined' && (window as any).umami) {
				(window as any).umami.track('newsletter_subscribe');
			}
		} catch {
			setErrorMsg(t.error);
			setStatus('error');
		}
	}

	if (status === 'success') {
		return (
			<div className={className}>
				<p className="font-body text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
					{t.success}
				</p>
			</div>
		);
	}

	return (
		<div className={className}>
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
							placeholder={inputPlaceholder || t.placeholder}
							className={`w-full px-4 py-3 rounded-lg border-2 font-body text-sm
							focus:outline-none focus:ring-2 transition-colors
							${errorMsg
									? 'border-red-400 bg-red-50'
									: accentColor ? '' : 'border-amber-300 bg-white'
								}
							${accentColor ? '' : 'focus:ring-amber-400'}
						`}
							style={!errorMsg && accentColor ? { borderColor: accentColor, backgroundColor: 'white' } : undefined}
							disabled={status === 'loading'}
							autoComplete="email"
							aria-label="Email"
						/>
						{/* Honeypot — invisible to humans, catches bots */}
						<input
							ref={honeypotRef}
							type="text"
							name="company"
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
						className={`px-6 py-3 ${accentColor ? '' : 'bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300'}
							text-white font-bold text-sm rounded-lg transition-all duration-200
							hover:scale-105 active:scale-95 disabled:hover:scale-100
							shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2`}
						style={accentColor ? { backgroundColor: accentColor, color: 'white' } : undefined}
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
							buttonText || t.submit
						)}
					</button>
				</div>
				{errorMsg && (
					<p className="mt-2 text-sm text-red-600 font-body">{errorMsg}</p>
				)}
			</form>
		</div>
	);
}
