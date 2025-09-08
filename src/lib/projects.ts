// Project data structure and management
interface ProjectImage {
	src: string;
	type: 'thumbnail' | 'gallery' | 'both';
	position?: string; // CSS object-position value (e.g., "center", "top", "25% 75%")
	caption?: {
		en: string;
		'pt-BR': string;
	}; // Optional localized caption for full-screen viewer
}

export interface ProjectData {
	id: string;
	title: {
		en: string;
		'pt-BR': string;
	};
	subtitle: {
		en: string;
		'pt-BR': string;
	};
	images: ProjectImage[];
	cycleDuration: number;
	featured?: boolean;
	year?: number;
	category?: string;
	hide?: boolean;
	bannerImage?: string;
	titleImage?: string;
	description?: {
		en: string;
		'pt-BR': string;
	};
	longDescription?: {
		en: string;
		'pt-BR': string;
	};
	platform?: string[];
	platformLinks?: {
		[platform: string]: string;
	};
	platformMessages?: {
		[platform: string]: {
			en: string;
			'pt-BR': string;
		};
	};
	status?: 'development' | 'released' | 'prototype' | 'cancelled';
	releaseDate?: string;
	teamSize?: number;
	projectType?: 'studio' | 'client';
	links?: {
		website?: string;
		steam?: string;
		itchio?: string;
		github?: string;
		playStore?: string;
		appStore?: string;
		youtube?: string;
		twitter?: string;
		discord?: string;
		linkedin?: string;
		figma?: string;
		roblox?: string;
		wiki?: string;
	};
	videos?: string[];
	awards?: {
		en: string[];
		'pt-BR': string[];
	};
	challenges?: {
		en: string[];
		'pt-BR': string[];
	};
	features?: {
		en: string[];
		'pt-BR': string[];
	};
}

// Projects database
export const projectsDatabase: ProjectData[] = [
	{
		id: 'asumi',
		title: {
			en: 'Asumi',
			'pt-BR': 'Asumi'
		},
		subtitle: {
			en: 'Little Things',
			'pt-BR': 'Little Things'
		},
		description: {
			en: 'A cozy exploration game where you live alongside exotic animals on your own island.',
			'pt-BR': 'Um jogo de exploração cozy onde você convive com os animais exóticos da sua própria ilha.'
		},
		longDescription: {
			en: 'Asumi is a cozy mobile-first exploration and social game, designed to be fun on both PC and mobile devices. Explore your own island filled with Brazilian fauna animals, make friendships, play music, interact with your friends, take memorable photos, and customize your character.',
			'pt-BR': 'Asumi é um jogo "cozy" mobile-first de exploração e convivência, criado para ser divertido tanto no PC quanto em celulares e tablets. Explore sua própria ilha cheia de animais da fauna brasileira, faça amizades, toque música, interaja com seus amigos, tire fotos memoráveis e customize seu personagem.'
		},
		platform: ['Android', 'iOS'],
		platformMessages: {
			android: {
				en: 'Coming later this year...',
				'pt-BR': 'Chegando ainda este ano...'
			},
			ios: {
				en: 'Coming later this year...',
				'pt-BR': 'Chegando ainda este ano...'
			}
		},
		status: 'development',
		releaseDate: '2025 Q3',
		teamSize: 6,
		projectType: 'studio',
		links: {
			figma: 'https://www.figma.com/design/Pk52yH6ZwmdJxX6CwUtRb1/Asumi-%7C-Portf%C3%B3lio?node-id=0-1&p=f&t=2UqtblEiXyFUiK3E-0'
		},
		features: {
			en: [
				'20+ original animals, complete with animation and a complex routine system',
				'15+ collectible items that help players get closer for the perfect photo',
				'Exploration tools like camera, flute, and flashlight',
				'Photo sharing with friends'
			],
			'pt-BR': [
				'20+ animais originais, completos com animação e um sistema complexo de rotina',
				'15+ itens coletáveis que ajudam o player a se aproximar para tirar a foto perfeita',
				'Ferramentas de exploração, como a câmera, a flauta e a lanterna',
				'Compartilhamento de fotos com os amigos'
			]
		},
		images: [
			{
				src: '/assets/projects/asumi/asumi-1.png',
				type: 'both',
				position: 'center',
				caption: {
					en: 'Player exploring their inventory at night',
					'pt-BR': 'Jogador explorando seu inventário à noite'
				}
			},
			{
				src: '/assets/projects/asumi/asumi-2.png',
				type: 'both',
				position: '25% 25%',
				caption: {
					en: 'Player reading the Green Mantis\'s page',
					'pt-BR': 'Jogador lendo a página do Louva-a-Deus Verde'
				}
			},
			{
				src: '/assets/projects/asumi/asumi-3.jpg',
				type: 'both',
				position: '75% 50%',
				caption: {
					en: 'Concept idea that includes taking care of a pet',
					'pt-BR': 'Conceito que inclui cuidar de um animal de estimação'
				}
			},
			{
				src: '/assets/projects/asumi/gallery-1.png',
				type: 'gallery',
				position: 'center',
				caption: {
					en: 'The mystical tome that holds all of Asumi\'s collected knowledge and spells',
					'pt-BR': 'O tomo místico que guarda todo o conhecimento e magias coletados por Asumi'
				}
			}
		],
		cycleDuration: 1.8,
		featured: true,
		year: 2025,
		category: 'unity',
		bannerImage: '/assets/projects/asumi/banner2.png',
		titleImage: '/assets/projects/asumi/title.png',
	},
	{
		id: 'fungalore',
		title: {
			en: 'Fungalore',
			'pt-BR': 'Fungalore'
		},
		subtitle: {
			en: 'Tower Defense',
			'pt-BR': 'Tower Defense'
		},
		description: {
			en: 'A Mobile Tower Defense game with wacky mushrooms that follow the light and fight with grit.',
			'pt-BR': 'Um jogo de Tower Defense com cogumelos atrapalhados que seguem a luz e lutam com determinação.'
		},
		longDescription: {
			en: 'Fungalore is a mobile Tower Defense game, inspired by classics like Bloons TD and Kingdom Rush. Defend your hero from waves of crazed monsters with your quirky mushrooms using strategic thinking and clever tactics.',
			'pt-BR': 'Fungalore é um jogo de Tower Defense mobile, inspirado em clássicos como Bloons TD e Kingdom Rush. Defenda seu herói de ondas de monstros enfurecidos com seus cogumelos atrapalhados, usando pensamento estratégico e táticas inteligentes.'
		},
		platform: ['Android', 'iOS'],
		platformMessages: {
			android: {
				en: 'To be determined',
				'pt-BR': 'A definir'
			},
			ios: {
				en: 'To be determined',
				'pt-BR': 'A definir'
			}
		},
		status: 'development',
		releaseDate: 'TBD',
		teamSize: 4,
		projectType: 'studio',
		features: {
			en: [
				'A build system with 20+ unique mushrooms and towers',
				'Distinct archetypes inspired by classics like MTG',
				'Challenge Stages that permanently unlock new towers and heroes',
				'Modifiers that reward experienced players with new ways to play'
			],
			'pt-BR': [
				'Variedade com mais de 20 cogumelos e torres únicas',
				'Arquétipos distintos inspirados por clássicos como MTG',
				'Fases de Desafio que desbloqueiam torres e heróis permanentemente',
				'Modificadores que recompensam jogadores com novas formas de jogar'
			]
		},
		images: [
			{
				src: '/assets/projects/fungalore/fungalore-1.png',
				type: 'both',
				position: 'center',
				caption: {
					en: 'Flying enemy',
					'pt-BR': 'Inimigo voador'
				}
			},
		],
		cycleDuration: 2.2,
		featured: true,
		hide: true,
		year: 2025,
		category: 'unity'
	},
	{
		id: 'phora',
		title: {
			en: 'Roblox Phora Lab',
			'pt-BR': 'Roblox Phora Lab'
		},
		subtitle: {
			en: 'Your Own Makeup Lab',
			'pt-BR': 'Seu Próprio Laboratório de Maquiagem'
		},
		description: {
			en: 'A makeup lab experience in Roblox where players can experiment with different styles and treatments.',
			'pt-BR': 'Uma experiência Roblox de salão de beleza e maquiagem onde jogadores podem experimentar diferentes estilos e tratamentos.'
		},
		images: [
			{
				src: '/assets/projects/phora/phora-1.jpg',
				type: 'both',
				position: 'center'
			}
		],
		cycleDuration: 4,
		year: 2024,
		category: 'roblox',
		platform: ['Roblox'],
		projectType: 'client',
		status: 'released',
		hide: true,
		teamSize: 1,
		platformLinks: {
			roblox: 'https://www.roblox.com/pt/games/120816315961165/Phora-Lab'
		},
		// links: {
		// 	github: 'https://github.com/madeinbugs/phora-lab',
		// }
	},
	{
		id: 'pizza',
		title: {
			en: 'Nik & Mussarela',
			'pt-BR': 'Nik & Mussarela'
		},
		subtitle: {
			en: 'Arcade Catching Mobile Game',
			'pt-BR': 'Jogo Mobile de Captura Arcade'
		},
		images: [
			{
				src: '/assets/projects/pizza/pizza-1.jpg',
				type: 'both',
				position: 'center'
			},
			{
				src: '/assets/projects/pizza/pizza-2.jpg',
				type: 'both',
				position: 'center'
			}
		],
		cycleDuration: 2.5,
		year: 2024,
		category: 'unity',
		platform: ['Android', 'iOS'],
		hide: true,
		links: {
			itchio: 'https://madeinbugs.itch.io/nik-mussarela',
			playStore: 'https://play.google.com/store/apps/details?id=com.madeinbugs.pizza'
		}
	},
	{
		id: 'animunch',
		title: {
			en: 'Animunch',
			'pt-BR': 'Animunch'
		},
		subtitle: {
			en: 'Retro-Inspired Mobile Puzzle Game',
			'pt-BR': 'Jogo Mobile Puzzle Inspirado em Clássicos'
		},
		description: {
			en: 'A game inspired by retro puzzle games with modern mobile gameplay mechanics.',
			'pt-BR': 'Um jogo inspirado em quebra-cabeças retrô com mecânicas modernas para mobile.'
		},
		features: {
			en: [
				'Online multiplayer',
				'Cosmetics system',
				'Five challenging story levels',
				'Extra puzzle levels',
				'Endless mode'
			],
			'pt-BR': [
				'Multijogador online',
				'Sistema de cosméticos',
				'Cinco níveis de história desafiadores',
				'Níveis puzzle extras',
				'Modo infinito'
			]
		},
		images: [
			{
				src: '/assets/projects/animunch/animunch-7.png',
				type: 'thumbnail',
				position: '50% 20%'
			},
			{
				src: '/assets/projects/animunch/animunch-6.png',
				type: 'thumbnail',
				position: '50% 20%'
			},
			{
				src: '/assets/projects/animunch/animunch-4.png',
				type: 'gallery',
				position: 'center',
				caption: {
					en: 'Main gameplay interface with collectible items',
					'pt-BR': 'Interface principal do jogo com itens colecionáveis'
				}
			},
			{
				src: '/assets/projects/animunch/animunch-1.png',
				type: 'gallery',
				position: '50% 85%',
				caption: {
					en: 'Character selection screen featuring various animals',
					'pt-BR': 'Tela de seleção de personagem com vários animais'
				}
			}
		],
		cycleDuration: 4,
		year: 2024,
		category: 'unity',
		platform: ['Android', 'iOS'],
		featured: false,
		teamSize: 4,
		projectType: 'client',
		status: 'development',
		bannerImage: '/assets/projects/animunch/banner.png',
		titleImage: '/assets/projects/animunch/title.png',
	},
	{
		id: 'elementales',
		title: {
			en: 'Elementales',
			'pt-BR': 'Elementales'
		},
		subtitle: {
			en: 'Monster Catcher Mobile Game',
			'pt-BR': 'Jogo Mobile de Captura de Monstros'
		},
		description: {
			en: 'An adventure game where you collect Elemantors, battle using dice, and explore the world of Ellion.',
			'pt-BR': 'Um jogo de aventura onde você coleta Elemantors, batalha usando dados, e explora o mundo de Ellion.'
		},
		features: {
			en: [
				'Pokémon-like battles with dice mechanics',
				'Fishing and planting activities',
				'Epic story quest for the Time Elixir',
				'60+ Elemantors of varying rarity to catch',
				'20+ areas to explore, some hidden'
			],
			'pt-BR': [
				'Batalhas estilo Pokémon com mecânicas de dados',
				'Atividades de pesca e plantio',
				'Missão épica pelo Elixir do Tempo',
				'60+ Elemantors de raridade variada para capturar',
				'20+ áreas para explorar, algumas escondidas'
			]
		},
		images: [
			{
				src: '/assets/projects/elementales/elementales-icon.png',
				type: 'thumbnail',
				position: 'center'
			},
			{
				src: '/assets/projects/elementales/elementales-1.jpg',
				type: 'gallery',
				position: 'center'
			},
			{
				src: '/assets/projects/elementales/elementales-2.png',
				type: 'gallery',
				position: 'center'
			},
			{
				src: '/assets/projects/elementales/elementales-3.jpg',
				type: 'gallery',
				position: 'center'
			},
			{
				src: '/assets/projects/elementales/elementales-4.png',
				type: 'gallery',
				position: 'center'
			},
			{
				src: '/assets/projects/elementales/elementales-5.png',
				type: 'gallery',
				position: '30% 50%'
			},
			{
				src: '/assets/projects/elementales/elementales-6.png',
				type: 'gallery',
				position: '18% 50%'
			}
		],
		cycleDuration: 2.5,
		year: 2022,
		category: 'unity',
		platform: ['Android'],
		platformLinks: {
			android: 'https://play.google.com/store/apps/details?id=com.P3TGaming.Elementales&hl=pt_BR'
		},
		links: {
			wiki: 'https://cyber-father-c4f.notion.site/Elementales-Wiki-76245a98df0b4e8485e88a166c985e03'
		},
		teamSize: 3,
		projectType: 'client',
		status: 'released'
	},
	{
		id: 'monster girls',
		title: {
			en: 'monstergirls',
			'pt-BR': 'monstergirls'
		},
		subtitle: {
			en: 'Monster Catcher Mobile game',
			'pt-BR': 'Jogo Mobile de Captura de Monstros'
		},
		images: [
			{
				src: '/assets/projects/monstergirls/monstergirls-1.jpg',
				type: 'both',
				position: 'center'
			},
			{
				src: '/assets/projects/monstergirls/monstergirls-2.jpg',
				type: 'both',
				position: 'center'
			}
		],
		cycleDuration: 2.7,
		year: 2022,
		category: 'unity',
		platform: ['Android'],
		hide: true
	}
];

// Helper functions
export function getProjectById(id: string): ProjectData | undefined {
	return projectsDatabase.find(project => project.id === id);
}

export function getProjectsByCategory(category: string): ProjectData[] {
	return projectsDatabase.filter(project => project.category === category && !project.hide);
}

export function getFeaturedProjects(): ProjectData[] {
	return projectsDatabase.filter(project => project.featured && !project.hide);
}

export function getAllProjects(): ProjectData[] {
	return projectsDatabase.filter(project => !project.hide);
}

// Get images filtered by type
export function getThumbnailImages(project: ProjectData): ProjectImage[] {
	return project.images.filter(img => img.type === 'thumbnail' || img.type === 'both');
}

export function getGalleryImages(project: ProjectData): ProjectImage[] {
	return project.images.filter(img => img.type === 'gallery' || img.type === 'both');
}

// Legacy compatibility - get image sources as strings for existing components
export function getThumbnailImageSources(project: ProjectData): string[] {
	return getThumbnailImages(project).map(img => img.src);
}

export function getThumbnailImagePositions(project: ProjectData): string[] {
	return getThumbnailImages(project).map(img => img.position || 'center');
}

// Get localized project data
export function getLocalizedProject(project: ProjectData, locale: 'en' | 'pt-BR') {
	return {
		...project,
		title: project.title[locale],
		subtitle: project.subtitle[locale]
	};
}
