'use client';

import type { Locale } from '../../../lib/services/types';

interface ConsentCheckboxProps {
	locale: Locale;
	accepted: boolean;
	onChange: (accepted: boolean) => void;
}

export default function ConsentCheckbox({ locale, accepted, onChange }: ConsentCheckboxProps) {
	return (
		<label className="flex items-start gap-2 cursor-pointer">
			<input
				type="checkbox"
				checked={accepted}
				onChange={(e) => onChange(e.target.checked)}
				className="mt-0.5 rounded border-neutral-300 text-[#04c597] focus:ring-[#04c597]"
			/>
			<span className="text-xs text-neutral-600 leading-relaxed">
				{locale === 'en' ? (
					<>
						I agree to the{' '}
						<a href="/en/terms/services" className="text-[#04c597] hover:underline" target="_blank" rel="noopener noreferrer">
							Terms of Service
						</a>{' '}
						and{' '}
						<a href="/en/privacy/services" className="text-[#04c597] hover:underline" target="_blank" rel="noopener noreferrer">
							Privacy Policy
						</a>
					</>
				) : (
					<>
						Concordo com os{' '}
						<a href="/pt-BR/terms/services" className="text-[#04c597] hover:underline" target="_blank" rel="noopener noreferrer">
							Termos de Serviço
						</a>{' '}
						e a{' '}
						<a href="/pt-BR/privacy/services" className="text-[#04c597] hover:underline" target="_blank" rel="noopener noreferrer">
							Política de Privacidade
						</a>
					</>
				)}
			</span>
		</label>
	);
}
