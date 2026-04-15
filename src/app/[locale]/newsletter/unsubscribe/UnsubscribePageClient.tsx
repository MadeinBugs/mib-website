'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

const messages = {
	en: {
		heading: 'Unsubscribe',
		confirm: 'Are you sure you want to unsubscribe?',
		confirmDetail: 'You will stop receiving all emails from the Bugsletter.',
		yes: 'Yes, unsubscribe',
		no: 'No, go back',
		loading: 'Unsubscribing...',
		success: "Done. You've been unsubscribed.",
		successDetail: "You won't receive any more emails from us.",
		back: 'Back to homepage',
		errorInvalid: 'This unsubscribe link is invalid or has been tampered with.',
		errorGeneric: 'Something went wrong. Please try again.',
		errorRate: 'Too many requests. Please wait a moment and try again.',
	},
	'pt-BR': {
		heading: 'Cancelar inscrição',
		confirm: 'Tem certeza que deseja cancelar sua inscrição?',
		confirmDetail: 'Você deixará de receber todos os emails da Bugsletter.',
		yes: 'Sim, cancelar inscrição',
		no: 'Não, voltar',
		loading: 'Cancelando...',
		success: 'Inscrição cancelada.',
		successDetail: 'Você não receberá mais emails nossos.',
		back: 'Voltar à página inicial',
		errorInvalid: 'Este link de cancelamento é inválido ou foi adulterado.',
		errorGeneric: 'Algo deu errado. Por favor, tente novamente.',
		errorRate: 'Muitas tentativas. Aguarde um momento e tente novamente.',
	},
} as const;

type UiState = 'confirm' | 'loading' | 'success' | 'error';

function UnsubscribeContent({ locale }: { locale: 'pt-BR' | 'en' }) {
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const sig = searchParams.get('sig');

	const t = messages[locale];

	const [state, setState] = useState<UiState>('confirm');
	const [errorMessage, setErrorMessage] = useState('');

	const missing = !email || !sig;

	async function handleUnsubscribe() {
		if (!email || !sig) return;

		setState('loading');
		try {
			const res = await fetch('/api/newsletter/unsubscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, sig }),
			});

			if (res.status === 403) {
				setState('error');
				setErrorMessage(t.errorInvalid);
				return;
			}
			if (res.status === 429) {
				setState('error');
				setErrorMessage(t.errorRate);
				return;
			}
			if (!res.ok) {
				setState('error');
				setErrorMessage(t.errorGeneric);
				return;
			}

			setState('success');
		} catch {
			setState('error');
			setErrorMessage(t.errorGeneric);
		}
	}

	// Invalid link — missing params
	if (missing) {
		return (
			<main className="min-h-screen bg-red-50 pt-10 px-6">
				<div className="max-w-md w-full space-y-6 p-6 rounded-lg border-2 border-red-200">
					<p className="text-lg text-red-900 leading-relaxed">{t.errorInvalid}</p>
					<Link
						href={`/${locale}`}
						className="inline-block px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
					>
						{t.back}
					</Link>
				</div>
			</main>
		);
	}

	// Success state
	if (state === 'success') {
		return (
			<main className="min-h-screen bg-green-50 pt-10 px-6">
				<div className="max-w-md w-full space-y-6 p-6 rounded-lg border-2 border-green-200">
					<h1 className="text-xl font-bold text-green-900">{t.success}</h1>
					<p className="text-green-800">{t.successDetail}</p>
					<Link
						href={`/${locale}`}
						className="inline-block px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
					>
						{t.back}
					</Link>
				</div>
			</main>
		);
	}

	// Error state
	if (state === 'error') {
		return (
			<main className="min-h-screen bg-red-50 pt-10 px-6">
				<div className="max-w-md w-full space-y-6 p-6 rounded-lg border-2 border-red-200">
					<p className="text-lg text-red-900 leading-relaxed">{errorMessage}</p>
					<div className="flex gap-3">
						<button
							onClick={() => setState('confirm')}
							className="px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
						>
							{t.no}
						</button>
					</div>
				</div>
			</main>
		);
	}

	// Confirm / Loading state
	return (
		<main className="min-h-screen bg-gray-50 pt-10 px-6">
			<div className="max-w-md w-full space-y-6 p-6 rounded-lg border-2 border-gray-200">
				<h1 className="text-xl font-bold text-gray-900">{t.heading}</h1>
				<p className="text-lg text-gray-700 leading-relaxed">{t.confirm}</p>
				<p className="text-sm text-gray-500">{t.confirmDetail}</p>
				<div className="flex gap-3">
					<button
						onClick={handleUnsubscribe}
						disabled={state === 'loading'}
						className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{state === 'loading' ? t.loading : t.yes}
					</button>
					<Link
						href={`/${locale}`}
						className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
					>
						{t.no}
					</Link>
				</div>
			</div>
		</main>
	);
}

export default function UnsubscribePageClient({ locale }: { locale: 'pt-BR' | 'en' }) {
	return (
		<Suspense>
			<UnsubscribeContent locale={locale} />
		</Suspense>
	);
}
