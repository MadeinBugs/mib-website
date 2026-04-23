import Image from 'next/image';
import Link from 'next/link';
import CodeEntryForm from '@/components/picture-contest/CodeEntryForm';
import { pictureContestTranslations } from '@/lib/pictureContestI18n';

const BG_IMAGE_PATH = '/assets/projects/asumi/bugsletter_bg.png';

export default async function PictureContestEntryPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const validLocale = locale === 'en' ? 'en' : 'pt-BR';
	const t = pictureContestTranslations[validLocale];
	const votingOpen = process.env.VOTING_OPEN === 'true';

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4">
			<Image
				src={BG_IMAGE_PATH}
				alt=""
				fill
				priority
				className="object-cover"
				sizes="100vw"
			/>
			<div className="relative z-10 flex flex-col items-center">
				<CodeEntryForm locale={locale} />

				{votingOpen && (
					<div className="mt-6 text-center bg-[#f7fff0]/90 rounded-crayon border-2 border-[#1e6259] shadow-lg px-6 py-4 max-w-md w-full">
						<p className="text-neutral-600 font-body text-sm mb-2">
							{t.votingLinkPrompt}
						</p>
						<Link
							href={`/${locale}/picture-contest/voting`}
							className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-body font-semibold transition-colors"
						>
							⭐ {t.votingLinkText}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
