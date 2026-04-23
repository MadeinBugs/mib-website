import { getTranslations, normalizeLocale } from '../../../lib/i18n';
import { getAllProjects } from '../../../lib/projects';
import ContentLayout from '../../../components/ContentLayout';
import ProjectThumbnail from '../../../components/ProjectThumbnail';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = normalizeLocale(rawLocale);

	// Load translations
	const t = await getTranslations(locale);

	// Get all projects
	const projects = getAllProjects();

	return (
		<ContentLayout translations={t} locale={locale}>
			<div className="space-y-8">
				{/* Page Header */}
				<div className="text-center space-y-6">
					<h1 className="heading-crayon">
						{locale === 'en' ? 'Our Work' : 'Nosso Trabalho'}
					</h1>
				</div>

				{/* Projects Grid - Irregular widths, consistent row heights */}
				<div className="space-y-6">
					{/* Group projects into rows with different layouts */}
					{(() => {
						interface RowPattern {
							count: number;
							widths: number[];
						}

						interface Row {
							projects: typeof projects;
							widths: number[];
							startIndex: number;
						}

						const rows: Row[] = [];
						let currentIndex = 0;

						const rowPatterns: RowPattern[] = [
							{ count: 3, widths: [1.2, 0.8, 1.0] },
							{ count: 4, widths: [1.0, 1.3, 0.7, 1.0] },
							{ count: 3, widths: [1.2, 0.8, 1.0] },
							{ count: 5, widths: [0.9, 1.1, 0.8, 1.0, 1.2] },
							{ count: 3, widths: [0.7, 1.4, 0.9] },
							{ count: 4, widths: [1.1, 0.9, 1.2, 0.8] },
						];

						const rowHeights = [
							'h-64',  // 256px
							'h-72',  // 288px
							'h-60',  // 240px
							'h-80',  // 320px
							'h-56',  // 224px
							'h-68',  // 272px
						];

						while (currentIndex < projects.length) {
							const pattern = rowPatterns[rows.length % rowPatterns.length];
							const rowProjects = projects.slice(currentIndex, currentIndex + pattern.count);

							if (rowProjects.length > 0) {
								rows.push({
									projects: rowProjects,
									widths: pattern.widths.slice(0, rowProjects.length),
									startIndex: currentIndex
								});
							}

							currentIndex += pattern.count;
						}

						return rows.map((row, rowIndex) => {
							// Calculate actual percentages based on multipliers
							const totalMultiplier = row.widths.reduce((sum: number, width: number) => sum + width, 0);
							const percentages = row.widths.map((width: number) => (width / totalMultiplier) * 100);

							// Get custom row height
							const rowHeight = rowHeights[rowIndex % rowHeights.length];

							return (
								<div key={rowIndex} className={`flex gap-4 ${rowHeight} justify-center`}>
									{row.projects.map((project, projectIndex) => {
										// Apply maximum width constraint (40%) for single items or very wide items
										const widthPercentage = percentages[projectIndex];
										const maxWidth = row.projects.length === 1 ? 40 : widthPercentage > 50 ? 50 : widthPercentage;
										const finalWidth = Math.min(widthPercentage, maxWidth);

										return (
											<div
												key={project.id}
												style={{ width: `${finalWidth}%` }}
												className="flex-shrink-0"
											>
												<ProjectThumbnail
													project={project}
													locale={locale as 'en' | 'pt-BR'}
													className="hover:z-10 h-full w-full aspect-auto"
												/>
											</div>
										);
									})}
								</div>
							);
						});
					})()}
				</div>

				{/* Empty state if no projects */}
				{projects.length === 0 && (
					<div className="text-center py-16">
						<div className="text-6xl mb-4">🎨</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							{locale === 'en' ? 'No Projects Yet' : 'Ainda Não Há Projetos'}
						</h3>
						<p className="text-gray-500">
							{locale === 'en'
								? 'Projects will appear here as they are added to the portfolio.'
								: 'Os projetos aparecerão aqui conforme forem adicionados ao portfólio.'
							}
						</p>
					</div>
				)}
			</div>
		</ContentLayout>
	);
}
