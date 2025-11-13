'use client';

import { useState } from 'react';
import ContentLayout from '../../../../components/ContentLayout';
import Image from 'next/image';
import ProjectImageVisualization from '../../../../components/ProjectImageVisualization';
import MarkdownDescription from '../../../../components/MarkdownDescription';
import { getGalleryImages, getTopGalleryImages } from '../../../../lib/projects';
import { getImagePath } from '../../../../lib/imagePaths';
import type { ProjectData } from '../../../../lib/projects';
import {
	FaGlobe,
	FaGithub,
	FaSteam,
	FaAppStore,
	FaGooglePlay,
	FaYoutube,
	FaTwitter,
	FaDiscord,
	FaLinkedin,
	FaFigma,
	FaBook,
	FaAndroid
} from 'react-icons/fa';
import { SiItchdotio, SiRoblox, SiIos } from 'react-icons/si';

interface ProjectPageClientProps {
	project: ProjectData;
	locale: string;
	translations: any;
}

export default function ProjectPageClient({ project, locale, translations }: ProjectPageClientProps) {
	const [selectedImage, setSelectedImage] = useState<{ src: string; caption?: string } | null>(null);
	const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

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

					{/* Top Gallery - Shows topGallery-type images */}
					{(() => {
						const topGalleryImages = getTopGalleryImages(project);

						return topGalleryImages.length > 0 && (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{topGalleryImages.map((image, index) => (
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
							{project.longDescription && (
								<div>
									<MarkdownDescription
										content={project.longDescription[locale as 'en' | 'pt-BR']}
										projectId={project.id}
									/>
								</div>
							)}
						</div>

						{/* Right Column - Technical Info */}
						<div className="space-y-6">
							{/* Project name and description */}
							<div className="content-card-sm">
								<h3 className="font-h2 text-xl font-bold mb-3">
									{localizedTitle}
								</h3>
								{project.description && (
									<p className="font-body text-gray-600 leading-relaxed">
										{project.description[locale as 'en' | 'pt-BR']}
									</p>
								)}
							</div>

							{/* Project Info without title */}
							{(project.status || project.releaseDate || project.teamSize || project.projectType) && (
								<div className="content-card-sm">
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

							{/* Consolidated Links Section */}
							{((project.platform && project.platform.length > 0) || (project.links && Object.keys(project.links).length > 0)) && (
								<div className="content-card-sm">
									<h3 className="font-h2 text-xl font-bold mb-4">
										{locale === 'en' ? 'Links' : 'Links'}
									</h3>
									<div className="space-y-2">
										{/* Platform Links */}
										{project.platform && project.platform.map((platform, index) => {
											const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
											const platformLink = project.platformLinks?.[normalizedPlatform];
											const platformMessage = project.platformMessages?.[normalizedPlatform];

											// Platform icon config
											const getPlatformIcon = (p: string) => {
												const pl = p.toLowerCase();
												if (pl.includes('android')) return FaAndroid;
												if (pl.includes('ios')) return SiIos;
												if (pl.includes('windows')) return FaGlobe;
												if (pl.includes('mac')) return FaGlobe;
												if (pl.includes('linux')) return FaGlobe;
												if (pl.includes('web')) return FaGlobe;
												if (pl.includes('roblox')) return SiRoblox;
												return FaGlobe;
											};

											const Icon = getPlatformIcon(platform);

											if (platformLink) {
												return (
													<a
														key={`platform-${index}`}
														href={platformLink}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-between w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md group"
													>
														<span className="flex items-center gap-2 text-sm font-medium text-blue-700">
															<Icon className="text-base flex-shrink-0 text-blue-600" />
															{platform}
														</span>
														<svg className="w-3 h-3 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
														</svg>
													</a>
												);
											} else {
												const message = platformMessage?.[locale as 'en' | 'pt-BR'] || (locale === 'en' ? 'Coming soon' : 'Em breve');
												const isHovered = hoveredPlatform === normalizedPlatform;
												return (
													<div
														key={`platform-${index}`}
														className="relative"
														onMouseEnter={() => setHoveredPlatform(normalizedPlatform)}
														onMouseLeave={() => setHoveredPlatform(null)}
													>
														<div className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg opacity-60 cursor-default">
															<span className="flex items-center gap-2 text-sm font-medium text-gray-600">
																<Icon className="text-base flex-shrink-0 opacity-60" />
																{platform}
															</span>
														</div>
														{isHovered && (
															<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
																<div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
																	{message}
																	<div className="absolute top-full left-1/2 transform -translate-x-1/2">
																		<div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-gray-800"></div>
																	</div>
																</div>
															</div>
														)}
													</div>
												);
											}
										})}

										{/* Project Links */}
										{project.links && Object.entries(project.links).filter(([_, url]) => url && url.trim() !== '').map(([linkType, url]) => {
											const getLinkIcon = (type: string) => {
												switch (type) {
													case 'website': return FaGlobe;
													case 'github': return FaGithub;
													case 'steam': return FaSteam;
													case 'itchio': return SiItchdotio;
													case 'playStore': return FaGooglePlay;
													case 'appStore': return FaAppStore;
													case 'youtube': return FaYoutube;
													case 'twitter': return FaTwitter;
													case 'discord': return FaDiscord;
													case 'linkedin': return FaLinkedin;
													case 'figma': return FaFigma;
													case 'roblox': return SiRoblox;
													case 'wiki': return FaBook;
													default: return FaGlobe;
												}
											};

											const getLinkLabel = (type: string) => {
												switch (type) {
													case 'website': return locale === 'en' ? 'Website' : 'Website';
													case 'github': return 'GitHub';
													case 'steam': return 'Steam';
													case 'itchio': return 'itch.io';
													case 'playStore': return 'Google Play';
													case 'appStore': return 'App Store';
													case 'youtube': return 'YouTube';
													case 'twitter': return 'Twitter';
													case 'discord': return 'Discord';
													case 'linkedin': return 'LinkedIn';
													case 'figma': return 'Art Bible';
													case 'roblox': return 'Roblox';
													case 'wiki': return 'Wiki';
													default: return type;
												}
											};

											const Icon = getLinkIcon(linkType);

											return (
												<a
													key={`link-${linkType}`}
													href={url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between w-full px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all duration-200 hover:shadow-md group"
												>
													<span className="flex items-center gap-2 text-sm font-medium text-purple-700">
														<Icon className="text-base flex-shrink-0 text-purple-600" />
														{getLinkLabel(linkType)}
													</span>
													<svg className="w-3 h-3 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
													</svg>
												</a>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Bottom Gallery - Shows regular gallery-type images */}
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
