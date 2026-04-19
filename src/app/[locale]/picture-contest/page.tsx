import Image from 'next/image';
import CodeEntryForm from '@/components/picture-contest/CodeEntryForm';

const BG_IMAGE_PATH = '/assets/projects/asumi/bugsletter_bg.png';

export default async function PictureContestEntryPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

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
			<div className="relative z-10">
				<CodeEntryForm locale={locale} />
			</div>
		</div>
	);
}
