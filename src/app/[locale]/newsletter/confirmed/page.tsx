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
		success: { text: "Subscription confirmed! You'll receive news soon." },
		already: { text: "You've already confirmed your subscription. Are you missing us?" },
		expired: { text: 'Link expired. It happens! Please subscribe again.' },
		invalid: { text: 'Invalid or expired link.' },
		error: { text: 'Something went wrong. Please try subscribing again.' },
		back: 'Homepage',
	},
	'pt-BR': {
		success: { text: 'Inscrição confirmada! Você receberá novidades em breve.' },
		already: { text: 'Você já confirmou sua inscrição anteriormente. Isso é saudades?' },
		expired: { text: 'Link expirado. Acontece! Por favor, inscreva-se novamente.' },
		invalid: { text: 'Link inválido ou expirado.' },
		error: { text: 'Algo deu errado. Tente se inscrever novamente.' },
		back: 'Página inicial',
	},
} as const;

type Status = 'success' | 'already' | 'expired' | 'invalid' | 'error';

const statusColors: Record<Status, { bg: string; border: string; text: string; button: string; buttonHover: string }> = {
	success: {
		bg: 'bg-green-50',
		border: 'border-green-200',
		text: 'text-green-900',
		button: 'bg-green-500',
		buttonHover: 'hover:bg-green-600',
	},
	already: {
		bg: 'bg-gray-50',
		border: 'border-gray-200',
		text: 'text-gray-900',
		button: 'bg-gray-500',
		buttonHover: 'hover:bg-gray-600',
	},
	expired: {
		bg: 'bg-red-50',
		border: 'border-red-200',
		text: 'text-red-900',
		button: 'bg-red-500',
		buttonHover: 'hover:bg-red-600',
	},
	invalid: {
		bg: 'bg-red-50',
		border: 'border-red-200',
		text: 'text-red-900',
		button: 'bg-red-500',
		buttonHover: 'hover:bg-red-600',
	},
	error: {
		bg: 'bg-red-50',
		border: 'border-red-200',
		text: 'text-red-900',
		button: 'bg-red-500',
		buttonHover: 'hover:bg-red-600',
	},
};

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
	const colors = statusColors[status];

	return (
		<main className={`min-h-screen ${colors.bg} pt-10 pl-6`}>
			<div className={`max-w-md w-full space-y-6 p-6 rounded-lg border-2 ${colors.border}`}>
				<p className={`text-lg ${colors.text} leading-relaxed`}>{msg.text}</p>
				<Link
					href={`/${locale}`}
					className={`inline-block px-6 py-3 rounded-lg ${colors.button} text-white font-semibold ${colors.buttonHover} transition-colors`}
				>
					{t.back}
				</Link>
			</div>
		</main>
	);
}
