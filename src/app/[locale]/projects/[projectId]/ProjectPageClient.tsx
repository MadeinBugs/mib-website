'use client';

import { useState } from 'react';
import ContentLayout from '../../../../components/ContentLayout';
import Image from 'next/image';
import ProjectLinks from '../../../../components/ProjectLinks';
import PlatformTags from '../../../../components/PlatformTags';
import ProjectImageVisualization from '../../../../components/ProjectImageVisualization';
import { getGalleryImages } from '../../../../lib/projects';
import { getImagePath } from '../../../../lib/imagePaths';
import type { ProjectData } from '../../../../lib/projects';

interface ProjectPageClientProps {
	project: ProjectData;
	locale: string;
	translations: any;
}

export default function ProjectPageClient({ project, locale, translations }: ProjectPageClientProps) {
	const [selectedImage, setSelectedImage] = useState<{ src: string; caption?: string } | null>(null);

	const localizedTitle = project.title[locale as 'en' | 'pt-BR'];
	const localizedSubtitle = project.subtitle[locale as 'en' | 'pt-BR'];

	return (
		<>
			{/* Full-width Banner Section */}
			{project.bannerImage && (
				<div className="relative h-[200px] w-full overflow-hidden">
					{/* Banner Background */}
					<Image
						src={getImagePath(project.bannerImage)}
						alt={`${localizedTitle} Banner`}
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					{/* Dark overlay for better text readability */}
					<div className="absolute inset-0 bg-black/40" />

					{/* Content over banner */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center space-y-3 text-white px-4">
							{project.titleImage ? (
								<div className="flex justify-center">
									<Image
										src={getImagePath(project.titleImage)}
										alt={localizedTitle}
										width={300}
										height={120}
										className="object-contain max-h-32"
										priority
									/>
								</div>
							) : (
								<>
									<h1 className="heading-crayon text-white drop-shadow-lg">
										{localizedTitle}
									</h1>
									<p className="font-body text-xl text-white/90 drop-shadow-md">
										{localizedSubtitle}
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			)}

			<ContentLayout translations={translations} locale={locale}>
				<div className="space-y-8">
					{/* Project Header (only shown if no banner) */}
					{!project.bannerImage && (
						<div className="text-center space-y-4">
							{project.titleImage ? (
								<div className="flex justify-center mb-6">
									<Image
										src={project.titleImage}
										alt={localizedTitle}
										width={400}
										height={200}
										className="object-contain max-h-48"
										priority
									/>
								</div>
							) : (
								<>
									<h1 className="heading-crayon">
										{localizedTitle}
									</h1>
									<p className="font-body text-xl text-gray-600">
										{localizedSubtitle}
									</p>
								</>
							)}
							{project.year && (
								<p className="font-body text-sm text-gray-500">
									{project.year}
								</p>
							)}
						</div>
					)}

					{/* Gallery - Shows all gallery-type images (moved to top) */}
					{(() => {
						const galleryImages = getGalleryImages(project);

						return galleryImages.length > 0 && (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{galleryImages.map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImage({
												src: image.src,
												caption: image.caption?.[locale as 'en' | 'pt-BR']
											})}
											className="aspect-[4/3] relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
										>
											<Image
												src={getImagePath(image.src)}
												alt={image.caption?.[locale as 'en' | 'pt-BR'] || `${localizedTitle} - Gallery ${index + 1}`}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
												style={{ objectPosition: image.position || 'center' }}
												sizes="(max-width: 768px) 100vw, 33vw"
												unoptimized={image.src.endsWith('.gif')}
											/>
											{/* Hover overlay */}
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
												<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
													<svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
													</svg>
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						);
					})()}

					{/* Project Details */}
					<div className="grid md:grid-cols-[70%_30%] gap-8">
						{/* Left Column - Description */}
						<div className="space-y-6">
							{project.description && (
								<div className="content-card-sm">
									<h3 className="font-h2 text-xl font-bold mb-3">
										{locale === 'en' ? 'About' : 'Sobre'}
									</h3>
									<p className="font-body text-gray-600 leading-relaxed">
										{project.description[locale as 'en' | 'pt-BR']}
									</p>
								</div>
							)}

							{project.longDescription && (
								<div className="content-card-sm">
									<h3 className="font-h2 text-xl font-bold mb-3">
										{locale === 'en' ? 'Detailed Description' : 'Descrição Detalhada'}
									</h3>
									<div className="font-body text-gray-600 leading-relaxed whitespace-pre-line">
										{project.longDescription[locale as 'en' | 'pt-BR']}
									</div>
								</div>
							)}

							{project.features && project.features[locale as 'en' | 'pt-BR']?.length > 0 && (
								<div className="content-card-sm">
									<h3 className="text-xl font-bold mb-3">
										{locale === 'en' ? 'Features' : 'Características'}
									</h3>
									<ul className="space-y-2">
										{project.features[locale as 'en' | 'pt-BR'].map((feature: string, index: number) => (
											<li key={index} className="flex items-start">
												<span className="text-blue-500 mr-2">•</span>
												<span className="text-gray-600">{feature}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>

						{/* Right Column - Technical Info */}
						<div className="space-y-6">
							{/* Only show Project Info if there's meaningful content */}
							{(project.status || project.releaseDate || project.teamSize || project.projectType) && (
								<div className="content-card-sm">
									<h3 className="font-h2 text-xl font-bold mb-4">
										{locale === 'en' ? 'Project Info' : 'Informações do Projeto'}
									</h3>
									<div className="space-y-3">
										{project.projectType && (
											<div className="flex justify-between">
												<span className="font-body font-medium text-gray-700">
													{locale === 'en' ? 'Type:' : 'Tipo:'}
												</span>
												<span className="font-body text-gray-600">
													{project.projectType === 'studio' ?
														(locale === 'en' ? '✨ Studio Original' : '✨ Autoral') :
														(locale === 'en' ? '🤝 Client Work' : '🤝 Trabalho Externo')
													}
												</span>
											</div>
										)}

										{project.status && (
											<div className="flex justify-between">
												<span className="font-body font-medium text-gray-700">
													{locale === 'en' ? 'Status:' : 'Status:'}
												</span>
												<span className={`font-body px-2 py-1 rounded text-sm ${project.status === 'released' ? 'bg-green-100 text-green-800' :
													project.status === 'development' ? 'bg-blue-100 text-blue-800' :
														project.status === 'prototype' ? 'bg-yellow-100 text-yellow-800' :
															'bg-gray-100 text-gray-800'
													}`}>
													{project.status === 'released' ?
														(locale === 'en' ? 'Released' : 'Lançado') :
														project.status === 'development' ?
															(locale === 'en' ? 'In Development' : 'Em Desenvolvimento') :
															project.status === 'prototype' ?
																(locale === 'en' ? 'Prototype' : 'Protótipo') :
																(locale === 'en' ? 'Cancelled' : 'Cancelado')
													}
												</span>
											</div>
										)}

										{project.releaseDate && (
											<div className="flex justify-between">
												<span className="font-body font-medium text-gray-700">
													{locale === 'en' ? 'Release Date:' : 'Data de Lançamento:'}
												</span>
												<span className="font-body text-gray-600">{project.releaseDate}</span>
											</div>
										)}

										{project.teamSize && (
											<div className="flex justify-between">
												<span className="font-medium text-gray-700">
													{locale === 'en' ? 'Team Size:' : 'Tamanho da Equipe:'}
												</span>
												<span className="text-gray-600">{project.teamSize}</span>
											</div>
										)}
									</div>
								</div>
							)}

							{project.platform && project.platform.length > 0 && (
								<PlatformTags
									platforms={project.platform}
									platformLinks={project.platformLinks}
									platformMessages={project.platformMessages}
									locale={locale}
								/>
							)}

							{project.links && Object.keys(project.links).length > 0 && (
								<ProjectLinks links={project.links} locale={locale} />
							)}
						</div>
					</div>
				</div>
			</ContentLayout>

			{/* Image Visualization Modal */}
			<ProjectImageVisualization
				imageSrc={selectedImage?.src || ''}
				imageCaption={selectedImage?.caption}
				isOpen={selectedImage !== null}
				onClose={() => setSelectedImage(null)}
			/>
		</>
	);
}
