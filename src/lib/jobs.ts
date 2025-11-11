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
// Os stubs anteriores foram removidos e substituídos pelas vagas reais.
export const jobsDatabase: JobData[] = [
	{
		id: 'prog-gameplay-unity',
		title: {
			en: 'Gameplay Programmer (Unity/C#)',
			'pt-BR': 'Programador(a) de Gameplay (Unity/C#)'
		},
		description: {
			en: 'We are looking for a versatile Gameplay Programmer to bring our game systems to life, from animal artificial intelligence to the final user interface.',
			'pt-BR': 'Buscamos um(a) programador(a) de gameplay versátil para dar vida aos nossos sistemas de jogo, desde a inteligência artificial dos animais até a interface de usuário final.'
		},
		responsibilities: {
			en: [
				'Develop complex AI systems (Behavior Trees, State Machines) for animals, including needs, routines, and predator/prey interactions.',
				'Integrate AI with player actions and the game environment.',
				'Implement the game UI/UX, ensuring responsiveness for different screen sizes.',
				'Create UI animations and effects for a polished user experience.'
			],
			'pt-BR': [
				'Desenvolver sistemas de IA complexos (Behavior Trees, State Machines) para animais, incluindo necessidades, rotinas e interações (predador/presa).',
				'Integrar a IA com as ações do jogador e o ambiente do jogo.',
				'Implementar a UI/UX do jogo, garantindo responsividade para diferentes tamanhos de tela.',
				'Criar animações e efeitos de UI para uma experiência de usuário polida.'
			]
		},
		requirements: {
			en: [
				'Solid experience in C# and the Unity Engine.',
				'Knowledge of AI system architecture (e.g., Behavior Trees, State Machines).',
				'Experience with Unity\'s UI system (UGUI or UI Toolkit).',
				'A portfolio demonstrating gameplay systems and interfaces you have created.'
			],
			'pt-BR': [
				'Experiência sólida em C# e Unity Engine.',
				'Conhecimento em arquitetura de sistemas de IA (ex: Behavior Trees, State Machines).',
				'Experiência com o sistema de UI da Unity (seja UGUI ou UI Toolkit).',
				'Um portfólio que demonstre sistemas de gameplay e interfaces que você criou.'
			]
		},
		niceToHaves: {
			en: [
				'Knowledge of UX/UI design principles.',
				'Experience with performance optimization (CPU).',
				'Understanding of Unity\'s DOTS/ECS.'
			],
			'pt-BR': [
				'Conhecimento de princípios de UX/UI design.',
				'Experiência com otimização de performance (CPU).',
				'Noções de DOTS/ECS da Unity.'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Programador(a) de Gameplay',
		active: true,
		jobDetails: {
			en: ['Remote', 'Contract', 'Brazil'],
			'pt-BR': ['Remoto', 'Freelance', 'Brasil']
		},
		postedDate: '2025-11-11'
	},
	{
		id: 'tech-artist-unity',
		title: {
			en: 'Technical Artist (Shaders & Performance)',
			'pt-BR': 'Artista Técnico (Shaders & Performance)'
		},
		description: {
			en: 'We are looking for a Technical Artist to be the crucial bridge between art and programming, focusing on creating incredible visuals while maintaining optimized performance.',
			'pt-BR': 'Procuramos um(a) Artista Técnico(a) para ser a ponte crucial entre a arte e a programação, focando em criar visuais incríveis enquanto mantém a performance otimizada.'
		},
		responsibilities: {
			en: [
				'Develop custom shaders and materials for game mechanics and visual effects.',
				'Work directly with 3D artists to optimize assets, textures, and lighting.',
				'Create and implement VFX (particles, etc.) for the environment and mechanics.',
				'Profile performance (GPU) and ensure the game hits its framerate targets.'
			],
			'pt-BR': [
				'Desenvolver shaders customizados e materiais para mecânicas de jogo e efeitos visuais.',
				'Trabalhar diretamente com artistas 3D para otimizar assets, texturas e iluminação.',
				'Criar e implementar VFX (partículas, etc.) para o ambiente e mecânicas.',
				'Realizar "profiling" de performance (GPU) e garantir que o jogo atinja suas metas de framerate.'
			]
		},
		requirements: {
			en: [
				'Mastery of shader development (HLSL/ShaderLab).',
				'Deep experience with Unity\'s render pipeline (URP or HDRP).',
				'Experience with optimization and profiling tools (e.g., Unity Profiler).',
				'Portfolio showcasing custom shaders and visual effects.'
			],
			'pt-BR': [
				'Domínio em desenvolvimento de shaders (HLSL/ShaderLab).',
				'Experiência profunda com a pipeline de renderização da Unity (URP ou HDRP).',
				'Experiência com ferramentas de otimização e profiling (ex: Unity Profiler).',
				'Portfólio com shaders e efeitos visuais que você criou.'
			]
		},
		niceToHaves: {
			en: [
				'C# programming experience (for editor tools).',
				'3D modeling or VFX skills.',
				'Experience with lighting and post-processing.'
			],
			'pt-BR': [
				'Experiência com programação C# (para ferramentas de editor).',
				'Habilidades de modelagem 3D ou VFX.',
				'Experiência com iluminação e pós-processamento.'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Artista Técnico',
		active: true,
		jobDetails: {
			en: ['Remote', 'Contract', 'Brazil'],
			'pt-BR': ['Remoto', 'Freelance', 'Brasil']
		},
		postedDate: '2025-11-11'
	},
	{
		id: 'level-designer',
		title: {
			en: 'Level Designer (with Environment Art skills)',
			'pt-BR': 'Level Designer (com habilidades de Environment Art)'
		},
		description: {
			en: 'We are looking for a creative Level Designer who loves building worlds, from the initial prototype (grayboxing) to the first pass of environment art.',
			'pt-BR': 'Buscamos um(a) Level Designer criativo(a) que ame construir mundos, desde o protótipo inicial (grayboxing) até a primeira passagem de arte do cenário.'
		},
		responsibilities: {
			en: [
				'Design and prototype level layouts (grayboxing) within Unity, focusing on flow, pacing, and game mechanics.',
				'Build and detail environments ("set dressing") using 3D assets (purchased or from our library).',
				'Model simple 3D environment assets (low-poly) for testing and prototyping as needed.',
				'Collaborate with the art and design team to ensure levels are both beautiful and functional.'
			],
			'pt-BR': [
				'Projetar e prototipar layouts de níveis (grayboxing) dentro da Unity, focando em fluxo, ritmo e mecânicas de jogo.',
				'Construir e detalhar os cenários ("set dressing") utilizando assets 3D (comprados ou da nossa biblioteca).',
				'Modelar assets 3D de cenário (low-poly) para testes e prototipagem, conforme necessário.',
				'Colaborar com a equipe de arte e design para garantir que os níveis sejam bonitos e funcionais.'
			]
		},
		requirements: {
			en: [
				'Proven experience as a Level Designer.',
				'Mastery of the Unity Engine for scene building (Terrain, ProBuilder, etc.).',
				'Strong skills in "grayboxing" and rapid prototyping.',
				'Basic to intermediate 3D modeling skills (e.g., Blender, Maya).'
			],
			'pt-BR': [
				'Experiência comprovada como Level Designer.',
				'Domínio da Unity Engine para construção de cenas (Terrain, ProBuilder, etc.).',
				'Habilidade em "grayboxing" e prototipagem rápida.',
				'Habilidades básicas a intermediárias de modelagem 3D (ex: Blender, Maya).'
			]
		},
		niceToHaves: {
			en: [
				'Experience as an Environment Artist.',
				'Knowledge of lighting and composition in Unity.',
				'Experience with level design tools (e.g., prefabs, colliders).'
			],
			'pt-BR': [
				'Experiência como Environment Artist (artista de cenário).',
				'Conhecimento de iluminação e composição em Unity.',
				'Experiência com ferramentas de level design (ex: prefabs, colisores).'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Level Designer',
		active: true,
		jobDetails: {
			en: ['Remote', 'Contract', 'Brazil'],
			'pt-BR': ['Remoto', 'Freelance', 'Brasil']
		},
		postedDate: '2025-11-11'

	},
	{
		id: '3d-artist-characters',
		title: {
			en: '3D Artist (Characters & Creatures)',
			'pt-BR': 'Artista 3D (Personagens & Criaturas)'
		},
		description: {
			en: 'We are looking for a talented 3D Artist to model, texture, rig, and animate the animals, characters, and items that bring our game to life.',
			'pt-BR': 'Procuramos um(a) Artista 3D talentoso(a) para modelar, texturizar, riggar e animar os animais, personagens e itens que dão vida ao nosso jogo.'
		},
		responsibilities: {
			en: [
				'Model and texture (high-poly and low-poly) creatures, characters, and items.',
				'Create Rigs and skin models.',
				'Animate movement cycles (walk, run, attack) and interaction animations.',
				'Work with the technical team to ensure assets work correctly in-game.'
			],
			'pt-BR': [
				'Modelagem e texturização (high-poly e low-poly) de criaturas, personagens e itens.',
				'Criação de Rigs (esqueletos) e skinning para os modelos.',
				'Animação de ciclos de movimento (andar, correr, atacar) e animações de interação.',
				'Trabalhar com a equipe técnica para garantir que os assets funcionem corretamente no jogo.'
			]
		},
		requirements: {
			en: [
				'Strong portfolio in 3D modeling (organic and hard-surface).',
				'Proven experience in Rigging.',
				'Solid 3D Animation skills (animation principles).',
				'Knowledge of PBR texturing (e.g., Substance Painter).'
			],
			'pt-BR': [
				'Portfólio forte em modelagem 3D (orgânica e hard-surface).',
				'Experiência comprovada em Rigging (esqueletagem).',
				'Habilidade sólida em Animação 3D (princípios de animação).',
				'Conhecimento em texturização PBR (ex: Substance Painter).'
			]
		},
		niceToHaves: {
			en: [
				'Sculpting experience (e.g., ZBrush).',
				'Specific experience rigging/animating quadrupeds or creatures.',
				'Knowledge of the character import pipeline in Unity.'
			],
			'pt-BR': [
				'Experiência com modelagem "sculpting" (ex: ZBrush).',
				'Experiência específica em rigging/animação de quadrúpedes ou criaturas.',
				'Conhecimento do pipeline de importação de personagens na Unity.'
			]
		},
		applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Vaga Artista 3D (Criaturas)',
		active: true,
		jobDetails: {
			en: ['Remote', 'Contract', 'Brazil'],
			'pt-BR': ['Remoto', 'Freelance', 'Brasil']
		},
		postedDate: '2025-11-11'
	}
];

// Helper functions (mantidos do seu arquivo original)
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