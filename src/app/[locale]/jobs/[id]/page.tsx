import { getTranslations, normalizeLocale } from '../../../../lib/i18n';
import ContentLayout from '../../../../components/ContentLayout';
import { getJobById, getAllJobs } from '../../../../lib/jobs';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
	params: Promise<{ locale: string; id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
	const { locale: rawLocale, id } = await params;
	const locale = normalizeLocale(rawLocale);

	// Load translations
	const t = await getTranslations(locale);

	// Get job data
	const job = getJobById(id);

	if (!job) {
		notFound();
	}

	const title = job.title[locale as 'en' | 'pt-BR'];
	const description = job.description[locale as 'en' | 'pt-BR'];
	const responsibilities = job.responsibilities?.[locale as 'en' | 'pt-BR'];
	const requirements = job.requirements?.[locale as 'en' | 'pt-BR'];
	const niceToHaves = job.niceToHaves?.[locale as 'en' | 'pt-BR'];
	const jobDetails = job.jobDetails?.[locale as 'en' | 'pt-BR'];

	return (
		<ContentLayout translations={t} locale={locale}>
			<div className="max-w-4xl mx-auto">
				{/* Back Button */}
				<Link
					href={`/${locale}/about#jobs`}
					className="inline-flex items-center text-gray-600 hover:text-purple-700 mb-6 transition-colors"
				>
					<svg
						className="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					{locale === 'en' ? 'Back to About Us' : 'Voltar para Sobre Nós'}
				</Link>

				{/* Job Header */}
				<div className="content-card mb-8">
					<div className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Nunito', fontWeight: 700 }}>{title}</div>
					<p className="text-gray-700">{description}</p>
				</div>

				{/* Job Details */}
				{jobDetails && jobDetails.length > 0 && (
					<div className="content-card mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							{locale === 'en' ? 'Job Details' : 'Detalhes da Vaga'}
						</h2>
						<ul className="space-y-3">
							{jobDetails.map((detail, index) => (
								<li key={index} className="flex items-start">
									<span className="text-purple-600 mr-3 mt-1">•</span>
									<span className="text-gray-700">{detail}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Responsibilities */}
				{responsibilities && responsibilities.length > 0 && (
					<div className="content-card mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							{locale === 'en' ? 'Responsibilities' : 'Responsabilidades'}
						</h2>
						<ul className="space-y-3">
							{responsibilities.map((item: string, index: number) => (
								<li key={index} className="flex items-start">
									<span className="text-purple-600 mr-3 mt-1">•</span>
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Requirements */}
				{requirements && requirements.length > 0 && (
					<div className="content-card mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							{locale === 'en' ? 'Requirements' : 'Requisitos'}
						</h2>
						<ul className="space-y-3">
							{requirements.map((item: string, index: number) => (
								<li key={index} className="flex items-start">
									<span className="text-purple-600 mr-3 mt-1">•</span>
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Nice to Haves */}
				{niceToHaves && niceToHaves.length > 0 && (
					<div className="content-card mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							{locale === 'en' ? 'Nice to Have' : 'Diferenciais'}
						</h2>
						<ul className="space-y-3">
							{niceToHaves.map((item: string, index: number) => (
								<li key={index} className="flex items-start">
									<span className="text-gray-400 mr-3 mt-1">+</span>
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Apply Button */}
				<div className="content-card text-center bg-gradient-to-br from-purple-50 to-blue-50">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						{locale === 'en' ? 'Interested?' : 'Interessado?'}
					</h2>
					<p className="text-gray-700 mb-6">
						{locale === 'en'
							? 'We would love to hear from you! Click the button below to apply.'
							: 'Adoraríamos ouvir de você! Clique no botão abaixo para se candidatar.'
						}
					</p>
					<a
						href={job.applyLink}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-lg"
					>
						{locale === 'en' ? 'Apply Now' : 'Quero me candidatar!'}
					</a>
				</div>
			</div>
		</ContentLayout>
	);
}

// Generate static paths for all jobs
export async function generateStaticParams() {
	const jobs = getAllJobs();
	const locales = ['en', 'pt-BR'];

	return locales.flatMap((locale) =>
		jobs.map((job) => ({
			locale,
			id: job.id
		}))
	);
}
