'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePictureContestLocale } from './PictureContestLocaleContext';

const CODE_REGEX = /^[BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ]$/;

export default function CodeEntryForm({ locale }: { locale: string }) {
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { t } = usePictureContestLocale();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const normalizedCode = code.trim().toUpperCase();

		if (!CODE_REGEX.test(normalizedCode)) {
			setError(t.codeInvalid);
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(`/api/contest/validate-code?code=${encodeURIComponent(normalizedCode)}`);
			const data = await res.json();

			if (!data.exists) {
				setError(t.codeNotFound);
				setLoading(false);
				return;
			}

			router.push(`/${locale}/picture-contest/${normalizedCode}`);
		} catch {
			setError(t.codeNotFound);
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-md bg-white rounded-crayon border-2 border-amber-300 shadow-xl p-8">
			<h1 className="font-h2 text-3xl font-bold text-center text-neutral-800 mb-2">
				📸 {t.entryTitle}
			</h1>
			<p className="text-center text-neutral-500 font-body mb-8">
				{t.entrySubtitle}
			</p>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<input
						type="text"
						maxLength={5}
						required
						value={code}
						onChange={(e) => setCode(e.target.value.toUpperCase())}
						className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] border-2 border-neutral-300 rounded-lg focus:border-amber-400 focus:outline-none transition-colors font-body uppercase"
						placeholder={t.codePlaceholder}
						autoComplete="off"
						spellCheck={false}
					/>
				</div>

				{error && (
					<p className="text-red-600 text-sm font-body bg-red-50 p-3 rounded-lg border border-red-200 text-center">
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={loading || code.length !== 5}
					className="w-full px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
				>
					{loading ? t.searching : t.viewPhotos}
				</button>
			</form>
		</div>
	);
}
