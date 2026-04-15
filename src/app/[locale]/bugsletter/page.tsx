import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterSignup from '../../../components/newsletter/NewsletterSignup';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { normalizeLocale } from '../../../lib/i18n';

const SITE_URL = 'https://www.madeinbugs.com.br';

// TODO: Replace with actual Asumi key art background image
const BG_IMAGE_PATH = '/assets/projects/asumi/asumi-bg.jpg';
const BANNER_URL = `${SITE_URL}/assets/mail/MiB-Mail-Banner1.png`;
const OG_IMAGE_PATH = '/assets/projects/asumi/asumi-og.jpg';

interface BugsletterStrings {
	title: string;
	description: string;
	reassurance: string;
	signature: string;
	backToSite: string;
	ogDescription: string;
}

async function getBugsletterStrings(locale: string): Promise<BugsletterStrings> {
	const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
	const raw = await fs.readFile(filePath, 'utf-8');
	const json = JSON.parse(raw);
	return json.bugsletter;
}

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'pt-BR' }];
}

interface Props {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale) as 'en' | 'pt-BR';
	const t = await getBugsletterStrings(locale);

	return {
		title: t.title,
		description: t.ogDescription,
		openGraph: {
			title: t.title,
			description: t.ogDescription,
			url: `${SITE_URL}/${rawLocale}/bugsletter`,
			images: [{ url: `${SITE_URL}${OG_IMAGE_PATH}`, width: 1200, height: 630, alt: t.title }],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: t.title,
			description: t.ogDescription,
			images: [`${SITE_URL}${OG_IMAGE_PATH}`],
		},
	};
}

export default async function BugsletterPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale) as 'en' | 'pt-BR';
	const t = await getBugsletterStrings(locale);

	return (
		<main className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#952020' }}>
			{/* Background image */}
			<Image
				src={BG_IMAGE_PATH}
				alt=""
				fill
				priority
				className="object-cover"
				sizes="100vw"
			/>

			{/* Dark overlay for readability */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

			{/* Language switcher */}
			<div className="absolute top-4 right-4 z-20">
				<LanguageSwitcher />
			</div>

			{/* Back to site link */}
			<Link
				href={`/${rawLocale}`}
				className="absolute top-4 left-4 z-20 text-sm text-white/60 hover:text-white/90 transition-colors font-body"
			>
				{t.backToSite}
			</Link>

			{/* Center card with banner */}
			<div className="relative z-10 w-full max-w-[480px] mx-4 my-8 rounded-lg overflow-hidden shadow-lg" style={{ borderColor: '#1e6259', borderWidth: '2px', borderStyle: 'solid' }}>
				{/* Banner */}
				<img
					src={BANNER_URL}
					alt="Made in Bugs"
					className="w-full block"
				/>

				{/* Card body */}
				<div className="p-8" style={{ backgroundColor: '#effee0' }}>
					{/* Header — (avoids h1 global !important override) */}
					<div role="heading" aria-level={1} className="text-center mb-4" style={{ fontFamily: "'Amatic SC', cursive", fontSize: '4rem', fontWeight: 700, color: '#04c597', textShadow: '-1px 1px 0px #016a50' }}>
						{t.title}
					</div>

					{/* Description */}
					<p className="font-body text-sm text-neutral-700 text-center leading-relaxed mb-6">
						{t.description}
					</p>

					{/* Subscribe form */}
					<NewsletterSignup locale={locale} accentColor="#36c8ab" />

					{/* Signature */}
					<p className="font-body text-xs text-neutral-400 text-right mt-4 italic">
						{t.signature}
					</p>
				</div>
			</div>
		</main>
	);
}
