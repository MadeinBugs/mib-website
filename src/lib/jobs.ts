// Job listing data structure and management

export interface JobData {
	id: string;
	title: {
		en: string;
		'pt-BR': string;
	};
	description: {
		en: string;
		'pt-BR': string;
	};
	applyLink: string;
	responsibilities?: {
		en: string[];
		'pt-BR': string[];
	};
	requirements?: {
		en: string[];
		'pt-BR': string[];
	};
	niceToHaves?: {
		en: string[];
		'pt-BR': string[];
	};
	jobDetails?: {
		en: string[];
		'pt-BR': string[];
	};
	active?: boolean;
	postedDate?: string;
}

// Jobs database
export const jobsDatabase: JobData[] = [
	{
		id: 'prog-gameplay-unity',
		title: {
			en: 'Gameplay Programmer (Unity/C#)',
			'pt-BR': 'Programador(a) de Gameplay (Unity/C#)'
		},
		description: {
			en: 'We are looking for a versatile Gameplay Programmer to bring our game systems to life, from animal artificial intelligence to the final polish.',
			'pt-BR': 'Buscamos um(a) programador(a) de gameplay versátil para dar vida aos nossos sistemas de jogo, desde a inteligência artificial dos animais até o polimento da versão final.'
		},
		responsibilities: {
			en: [
				'Develop complex AI systems (Behavior Trees, State Machines)',
				'Develop the main game mechanics',
				'Develop player actions for different controls (keyboard, gamepad)',
				'Create pull-requests and review pull-requests to maintain code quality',
				'Promote modular code architecture, avoiding super-classes and direct dependencies',
				'Continuously test the game to ensure it remains in a stable version',
			],
			'pt-BR': [
				'Desenvolver sistemas de IA complexos (Behavior Trees, State Machines)',
				'Desenvolver as mecânicas principais do jogo',
				'Desenvolver ações do jogador visando diferentes controles (teclado, gamepad)',
				'Criar pull-requests e fazer review de pull-requests para manter a qualidade do código',
				'Promover uma arquitetura de código modular, procurando evitar super-classes e dependências diretas',
				'Testar continuamente o jogo para garantir estar sempre em uma versão estável',
			]
		},
		requirements: {
			en: [
				'Solid experience in C# and Unity Engine',
				'Knowledge of AI system architecture (e.g., Behavior Trees, State Machines)',
				'Experience with Unity\'s 3D game pipeline',
				'Experience with version control (Git)',
			],
			'pt-BR': [
				'Experiência sólida em C# e Unity Engine',
				'Conhecimento em arquitetura de sistemas de IA (ex: Behavior Trees, State Machines)',
				'Experiência com a pipeline de jogos 3D na Unity',
				'Experiência com controle de versão (Git)',
			]
		},
		niceToHaves: {
			en: [
				'Knowledge of UX/UI design principles',
				'Experience with performance optimization and using Unity\'s profiler',
				'Experience using Addressables for asset management',
				'Experience adjusting 3D animations',
				'Experience with visual effects (VFX)',
			],
			'pt-BR': [
				'Conhecimento de princípios de UX/UI design',
				'Experiência com otimização de performance e utilizando o "profiling" da Unity',
				'Experiência utilizando Addressables para gerenciamento de assets',
				'Experiência ajustando animações 3D',
				'Experiência com efeitos visuais (VFX)'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Programador(a) de Gameplay',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese'],
			'pt-BR': ['Remoto', 'Freelance', 'Português']
		},
		postedDate: '2025-11-11'
	},
	{
		id: 'tech-artist-unity',
		title: {
			en: 'Technical Artist (Unity)',
			'pt-BR': 'Artista Técnico (Unity)'
		},
		description: {
			en: 'We are looking for a Technical Artist to be the bridge between art and programming, focusing on creating visual effects, optimizing performance, and working closely with the art team.',
			'pt-BR': 'Procuramos um(a) Artista Técnico(a) para ser a ponte entre a arte e a programação, focando em criar efeitos visuais, otimizar a performance e trabalhar próximo ao time de arte.'
		},
		responsibilities: {
			en: [
				'Develop custom shaders and materials for game mechanics and visual effects',
				'Work directly with 3D artists for implementation and testing of models, animations, textures, etc',
				'Create and implement VFX within Unity',
			],
			'pt-BR': [
				'Desenvolver shaders customizados e materiais para mecânicas de jogo e efeitos visuais',
				'Trabalhar diretamente com artistas 3D para implementação e teste de modelos, animações, texturas, etc',
				'Criar e implementar VFX dentro da Unity',
			]
		},
		requirements: {
			en: [
				'Deep knowledge of Unity\'s rendering pipeline and performance optimization techniques',
				'Mastery of shader development (Scripting/Shader Graph)',
				'Deep experience with Unity\'s rendering pipeline (URP)',
				'Experience analyzing Unity\'s profiler, knowledge of concepts like draw calls, batches, overdraw, etc',
				'Portfolio showcasing shaders and visual effects you\'ve created',
				'Experience with version control (Git)',
			],
			'pt-BR': [
				'Possuir conhecimento profundo sobre a pipeline de renderização da Unity e técnicas de otimização de performance',
				'Domínio em desenvolvimento de shaders (Scripting/Shader Graph)',
				'Experiência profunda com a pipeline de renderização da Unity (URP)',
				'Experiência analizando o profiler da Unity, conhecimento de conceitos como draw calls, batches, overdraw, etc',
				'Portfólio com shaders e efeitos visuais que você criou',
				'Experiência com controle de versão (Git)',
			]
		},
		niceToHaves: {
			en: [
				'C# programming experience (may be needed for editor tools)',
				'Brief experience with Blender',
				'Experience with lighting and post-processing',
			],
			'pt-BR': [
				'Experiência com programação C# (pode ser necessário para ferramentas de editor)',
				'Experiência, mesmo que breve, com Blender',
				'Experiência com iluminação e pós-processamento.'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Artista Técnico',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese'],
			'pt-BR': ['Remoto', 'Freelance', 'Português']
		},
		postedDate: '2025-11-11'
	},
	{
		id: 'level-designer',
		title: {
			en: 'Level Designer',
			'pt-BR': 'Level Designer'
		},
		description: {
			en: 'We are looking for a creative Level Designer who loves building worlds, from the prototype phase (grayboxing) to the assets that make up the environment.',
			'pt-BR': 'Buscamos um(a) Level Designer criativo(a) que ame construir mundos, desde a fase de protótipo (grayboxing) até os assets que compõem o cenário.'
		},
		responsibilities: {
			en: [
				'Design and prototype level layouts (grayboxing) within Unity, working closely with the Game Designer',
				'Build and detail environments using assets',
				'Model low-poly 3D environment assets',
				'Work closely with the 2D art team to translate concept art into 3D levels',
			],
			'pt-BR': [
				'Projetar e prototipar layouts de níveis (grayboxing) dentro da Unity, trabalhando junto ao Game Designer',
				'Construir e detalhar os cenários utilizando assets',
				'Modelar assets 3D low-poly de cenário',
				'Trabalhar próximo ao time de arte 2D para traduzir os concept-arts das fases para o 3D'
			]
		},
		requirements: {
			en: [
				'Experience as a Level Designer',
				'Brief experience in Unity for scene building (ProBuilder recommended)',
				'Ability to create grayblocking and rapid, iterative prototyping',
				'Experience with Blender for creating environment assets',
			],
			'pt-BR': [
				'Experiência como Level Designer',
				'Experiência, mesmo que breve, em Unity, na parte de construção de cenas (ProBuilder é recomendado)',
				'Capacidade de fazer "grayblocking" e prototipação rápida e iterativa',
				'Experiência com Blender na construção de assets para cenário'
			]
		},
		niceToHaves: {
			en: [
				'Knowledge of lighting and composition in Unity',
				'Experience with level design tools',
				'Experience with version control (Git) (we use it for asset versioning)',
			],
			'pt-BR': [
				'Conhecimento de iluminação e composição em Unity',
				'Experiência com ferramentas de level design',
				'Experiência com controle de versão (Git) (utilizamos para versionamento dos assets)'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Level Designer',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese'],
			'pt-BR': ['Remoto', 'Freelance', 'Português']
		},
		postedDate: '2025-11-11'

	},
	{
		id: '3d-artist-characters',
		title: {
			en: '3D Artist (Characters)',
			'pt-BR': 'Artista 3D (Personagens)'
		},
		description: {
			en: 'We are looking for a 3D Artist to model, texture, rig, and animate the animals, characters, and items that bring our game to life.',
			'pt-BR': 'Procuramos um(a) Artista 3D para modelar, texturizar, riggar e animar os animais, personagens e itens que dão vida ao nosso jogo.'
		},
		responsibilities: {
			en: [
				'Modeling and texturing (high-poly and low-poly) creatures, characters, and items',
				'Creating Rigs (skeletons) and skinning for models',
				'Animation of movement cycles (walk, run, sleep, etc.)',
				'Work with the technical team to ensure assets work correctly in the game',
			],
			'pt-BR': [
				'Modelagem e texturização (high-poly e low-poly) de criaturas, personagens e itens',
				'Criação de Rigs (esqueletos) e skinning para os modelos',
				'Animação de ciclos de movimento (andar, correr, dormir, etc.)',
				'Trabalhar com a equipe técnica para garantir que os assets funcionem corretamente no jogo'
			]
		},
		requirements: {
			en: [
				'Strong portfolio in 3D modeling',
				'Experience in Rigging',
				'Solid 3D Animation skills (preferably familiar with animation principles)',
				'Knowledge of texturing (preferably Substance Painter)',
			],
			'pt-BR': [
				'Portfólio forte em modelagem 3D',
				'Experiência em Rigging',
				'Habilidade sólida em Animação 3D (preferência por conhecer os princípios de animação)',
				'Conhecimento em texturização (preferência por Substance Painter)'
			]
		},
		niceToHaves: {
			en: [
				'Experience with game modeling',
				'Experience rigging/animating quadrupeds or creatures',
				'Knowledge of Unity\'s export/import pipeline',
				'Experience with version control (Git) (we use it for asset versioning)',
				'Knowledge of asset retopology for games',
				'Knowledge of LOD creation',
				'Knowledge of rendering optimizations like texture batching',
			],
			'pt-BR': [
				'Experiência com modelagem para jogos',
				'Experiência em rigging/animação de quadrúpedes ou criaturas',
				'Conhecimento do pipeline de exportação/importação na Unity',
				'Experiência com controle de versão (Git) (utilizamos para versionamento dos assets)',
				'Conhecimento em retopologia de assets para jogos',
				'Conhecimento em criação de LODs',
				'Conhecimento de otimizações de rendering como texture batching',
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Artista 3D (Criaturas)',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese'],
			'pt-BR': ['Remoto', 'Freelance', 'Português']
		},
		postedDate: '2025-11-11'
	}
];

// Helper functions
export function getJobById(id: string): JobData | undefined {
	return jobsDatabase.find(job => job.id === id);
}

export function getActiveJobs(): JobData[] {
	return jobsDatabase.filter(job => job.active !== false);
}

export function getAllJobs(): JobData[] {
	return jobsDatabase;
}

// Get localized job data
export function getLocalizedJob(job: JobData, locale: 'en' | 'pt-BR') {
	return {
		...job,
		title: job.title[locale],
		description: job.description[locale],
		responsibilities: job.responsibilities?.[locale],
		requirements: job.requirements?.[locale],
		niceToHaves: job.niceToHaves?.[locale],
		jobDetails: job.jobDetails?.[locale]
	};
}