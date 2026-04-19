import CodeEntryForm from '@/components/picture-contest/CodeEntryForm';

export default async function PictureContestEntryPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<CodeEntryForm locale={locale} />
		</div>
	);
}
