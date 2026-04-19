'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePictureContestLocale } from './PictureContestLocaleContext';

const CODE_REGEX = /^[BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ][AEIOU][BCDFGHJKLMNPRSTVWZ]$/;

export default function CodeEntryForm({ locale }: { locale: string }) {
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [errorKey, setErrorKey] = useState(0);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { t } = usePictureContestLocale();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const normalizedCode = code.trim().toUpperCase();

		if (!CODE_REGEX.test(normalizedCode)) {
			setError(t.codeInvalid);
			setErrorKey((k) => k + 1);
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(`/api/contest/validate-code?code=${encodeURIComponent(normalizedCode)}`);
			const data = await res.json();

			if (!data.exists) {
				setError(t.codeNotFound);
				setErrorKey((k) => k + 1);
				setLoading(false);
				return;
			}

			router.push(`/${locale}/picture-contest/${normalizedCode}`);
		} catch {
			setError(t.codeNotFound);
			setErrorKey((k) => k + 1);
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-md bg-[#f7fff0] rounded-crayon border-2 border-[#1e6259] shadow-xl p-8">
			<div role="heading" aria-level={1} className="text-center mb-2" style={{ fontFamily: "'Amatic SC', cursive", fontSize: 'clamp(3rem, 4vw + 1rem, 4rem)', fontWeight: 700, color: '#04c597', textShadow: '-1px 1px 0px #016a50' }}>
				{t.entryTitle}
			</div>
			<p className="text-center text-neutral-600 font-body mb-8">
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
						className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] border-2 border-[#1e6259]/30 rounded-lg focus:border-[#04c597] focus:outline-none transition-colors font-body uppercase"
						placeholder={t.codePlaceholder}
						autoComplete="off"
						spellCheck={false}
					/>
				</div>

				{error && (
					<p
						key={errorKey}
						className="text-red-600 text-sm font-body bg-red-50 p-3 rounded-lg border border-red-200 text-center animate-[shake_0.4s_ease-in-out]"
					>
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={loading || code.length !== 5}
					className="w-full px-6 py-3 bg-[#04c597] text-white font-semibold rounded-lg hover:bg-[#036b54] transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
				>
					{loading ? t.searching : t.viewPhotos}
				</button>
			</form>
		</div>
	);
}
