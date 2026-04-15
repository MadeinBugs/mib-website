import type { Metadata } from 'next';
import Link from 'next/link';

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

export const metadata: Metadata = {
	title: 'Newsletter — Made in Bugs',
};

const messages = {
	en: {
		success: { icon: '✅', text: "Subscription confirmed! You'll receive news soon." },
		already: { icon: '📬', text: "You've already confirmed your subscription. Are you missing us?" },
		expired: { icon: '⏳', text: 'Link expired. It happens! Please subscribe again.' },
		invalid: { icon: '❌', text: 'Invalid or expired link.' },
		error: { icon: '⚠️', text: 'Something went wrong. Please try subscribing again.' },
		back: 'Back to Asumi',
	},
	'pt-BR': {
		success: { icon: '✅', text: 'Inscrição confirmada! Você receberá novidades em breve.' },
		already: { icon: '📬', text: 'Você já confirmou sua inscrição anteriormente. Isso é saudades?' },
		expired: { icon: '⏳', text: 'Link expirado. Acontece! Por favor, inscreva-se novamente.' },
		invalid: { icon: '❌', text: 'Link inválido ou expirado.' },
		error: { icon: '⚠️', text: 'Algo deu errado. Tente se inscrever novamente.' },
		back: 'Voltar para o Asumi',
	},
} as const;

type Status = 'success' | 'already' | 'expired' | 'invalid' | 'error';

interface Props {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ status?: string }>;
}

export default async function NewsletterConfirmedPage({ params, searchParams }: Props) {
	const { locale: rawLocale } = await params;
	const { status: rawStatus } = await searchParams;

	const locale = rawLocale === 'pt-BR' ? 'pt-BR' : 'en';
	const validStatuses: Status[] = ['success', 'already', 'expired', 'invalid', 'error'];
	const status: Status = validStatuses.includes(rawStatus as Status)
		? (rawStatus as Status)
		: 'error';

	const t = messages[locale];
	const msg = t[status];

	return (
		<main className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-6">
			<div className="max-w-md w-full text-center space-y-6">
				<div className="text-5xl">{msg.icon}</div>
				<p className="text-lg text-gray-700 leading-relaxed">{msg.text}</p>
				<Link
					href={`/${locale}/projects/asumi`}
					className="inline-block mt-4 px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
				>
					{t.back}
				</Link>
			</div>
		</main>
	);
}
