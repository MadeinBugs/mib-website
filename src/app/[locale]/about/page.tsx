import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import ContentLayout from '../../../components/ContentLayout';
import TeamCarousel from '../../../components/TeamCarousel';
import JobListing from '../../../components/JobListing';
import PetsGallery from '../../../components/PetsGallery';
import teamData from '../../../data/team.json';
import petsData from '../../../data/pets.json';
import { getActiveJobs } from '../../../lib/jobs';
import Image from 'next/image';
import { getImagePath } from '../../../lib/imagePaths';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);

	// Load translations
	const t = await getTranslations(locale);

	// Load active jobs
	const activeJobs = getActiveJobs();

	// Filter active pets
	const activePets = petsData.pets.filter(pet => pet.active !== false);

	return (
		<ContentLayout translations={t} locale={locale}>
			<div className="space-y-12">
				{/* Hero Section */}
				<div className="text-center space-y-8">
					<h1 className="heading-crayon">
						{t.pages.about.title}
					</h1>

					{/* Main message */}
					<div className="max-w-4xl mx-auto space-y-6">
						<p className="text-2xl md:text-3xl font-bold text-gray-800">
							{locale === 'en'
								? 'Made in Bugs is an small game studio founded in 2024'
								: 'Made in Bugs é um estúdio de jogos indie fundado em 2024'
							}
						</p>
					</div>
				</div>

				{/* Team Section */}
				<div className="content-card">
					<h2 className="font-h2 text-2xl font-bold mb-4 text-center">
						{locale === 'en' ? 'Meet Our Team' : 'Conheça Nossa Equipe'}
					</h2>
					<TeamCarousel teamMembers={teamData.teamMembers} locale={locale} />
				</div>

				{/* Intro to Achievements */}
				<div className="text-center">
					<div className="max-w-4xl mx-auto">
						<p className="text-xl md:text-2xl text-gray-600 font-medium">
							{locale === 'en'
								? "Just some of the programs that have endorsed us!"
								: 'Alguns dos editais e programas que atestam nossa qualidade!'
							}
						</p>
					</div>
				</div>

				{/* Achievements Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
					<div className="text-center relative group">
						<div className="rounded-lg overflow-hidden h-48 flex items-center justify-center cursor-pointer">
							<Image
								src={getImagePath('/assets/about-us/paulo-gustavo.png')}
								alt={locale === 'en' ? 'Paulo Gustavo Grant Certificate' : 'Certificado Edital Paulo Gustavo'}
								width={400}
								height={300}
								className="w-full h-full object-contain"
							/>
							{/* Tooltip */}
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								{locale === 'en' ? 'Paulo Gustavo Grant Winner' : 'Ganhamos o Edital Paulo Gustavo'}
							</div>
						</div>
					</div>

					<div className="text-center relative group pb-20">
						<div className="rounded-lg overflow-hidden h-48 flex items-center justify-center cursor-pointer">
							<Image
								src={getImagePath('/assets/about-us/sampa-games.png')}
								alt={locale === 'en' ? 'Received R$30,000 Investment' : 'Recebemos R$30.000 de Investimento'}
								width={400}
								height={300}
								className="w-full h-full object-contain"
							/>
							{/* Tooltip */}
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								{locale === 'en' ? 'Received R$30,000 Investment' : 'Recebemos R$30.000 de Investimento'}
							</div>
						</div>
					</div>

					<div className="text-center relative group">
						<div className="rounded-lg overflow-hidden h-48 flex items-center justify-center cursor-pointer">
							<Image
								src={getImagePath('/assets/about-us/crie-games.png')}
								alt={locale === 'en' ? 'Sebrae Crie Games Mentorship Certificate' : 'Certificado Mentoria Sebrae Crie Games'}
								width={400}
								height={300}
								className="w-full h-full object-contain"
							/>
							{/* Tooltip */}
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
								{locale === 'en' ? 'Mentored by Sebrae Crie Games' : 'Mentoria da Sebrae Crie Games'}
							</div>
						</div>
					</div>
				</div>

				{/* Pet Gallery Section - Only show if there are active pets */}
				{activePets.length > 0 && (
					<div className="content-card text-center">
						{/* Nature Image - Using logo-no-title */}
						<div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
							<Image
								src={getImagePath('/assets/logo-no-title.png')}
								alt={locale === 'en' ? 'Made in Bugs Logo' : 'Logo Made in Bugs'}
								width={128}
								height={128}
								className="w-full h-full object-contain"
							/>
						</div>
						<h2 className="font-h2 text-2xl font-bold mb-4">
							{locale === 'en' ? 'Pet Gallery' : 'Galeria de Pets'}
						</h2>
						<p className="font-body text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
							{locale === 'en'
								? 'Every pet owned by our studio members'
								: 'Todos os pets dos membros do nosso estúdio'
							}
						</p>

						{/* Pets Gallery Section */}
						<div className="space-y-6">
							<PetsGallery pets={petsData.pets} locale={locale as 'en' | 'pt-BR'} />
						</div>
					</div>
				)}

				{/* Join Our Team Section */}
				{activeJobs.length > 0 && (
					<div id="jobs" className="content-card">
						<h2 className="font-h2 text-3xl font-bold mb-8 text-center">
							{locale === 'en' ? 'Join Our Team' : 'Junte-se ao Nosso Time'}
						</h2>
						<div className="space-y-4">
							{activeJobs.map((job, index) => (
								<JobListing key={job.id} job={job} locale={locale as 'en' | 'pt-BR'} isEven={index % 2 === 1} />
							))}
						</div>
					</div>
				)}
			</div>
		</ContentLayout>
	);
}
