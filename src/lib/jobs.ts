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
		applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdKTooQgHmSkTd1fEnVLB4Bj8LEWubNDsj_SkTz3HbLiUolpg/viewform?usp=header',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese', 'Estimated Time: Fulltime 40h/week'],
			'pt-BR': ['Remoto', 'Contrato PJ', 'Português', 'Tempo Estimado: Fulltime 40h/semana']
		},
		postedDate: '2024-11-11'
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
				'Experiência com iluminação e pós-processamento'
			]
		},
		applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLScYc1D_2kSwoWFkEUpGkycmzxf1xHl5YgRUVFSjU1aU9uUU8A/viewform?usp=header',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese', 'Estimated Time: Fulltime 40h/week'],
			'pt-BR': ['Remoto', 'Contrato PJ', 'Português', 'Tempo Estimado: Fulltime 40h/semana']
		},
		postedDate: '2024-11-11'
	},
	{
		id: 'level-designer',
		title: {
			en: 'Level Designer',
			'pt-BR': 'Level Designer'
		},
		description: {
			en: 'We are looking for a creative Level Designer to design engaging level layouts, focusing on gameplay flow, pacing, and player experience using prototyping and existing assets.',
			'pt-BR': 'Buscamos um(a) Level Designer criativo(a) para projetar layouts de fases envolventes, focando no fluxo de gameplay, ritmo e experiência do jogador usando prototipação e assets existentes.'
		},
		responsibilities: {
			en: [
				'Design and prototype level layouts (grayboxing) within Unity, working closely with the Game Designer',
				'Define gameplay flow, pacing, encounter placement, and level progression',
				'Build and detail environments using existing 3D assets from our library',
				'Work closely with the 2D art team to translate concept art into 3D level layouts',
				'Test and iterate on levels to ensure fun and balanced gameplay'
			],
			'pt-BR': [
				'Projetar e prototipar layouts de níveis (grayboxing) dentro da Unity, trabalhando junto ao Game Designer',
				'Definir o fluxo de gameplay, ritmo, posicionamento de encontros e progressão do nível',
				'Construir e detalhar os cenários utilizando assets 3D existentes da nossa biblioteca',
				'Trabalhar próximo ao time de arte 2D para traduzir os concept-arts das fases em layouts 3D',
				'Testar e iterar sobre os níveis para garantir gameplay divertido e balanceado'
			]
		},
		requirements: {
			en: [
				'Proven experience as a Level Designer',
				'Strong understanding of level design principles (flow, pacing, player guidance)',
				'Experience with Unity for scene building (ProBuilder or similar tools)',
				'Ability to create grayboxing and rapid, iterative prototyping',
				'Portfolio showcasing level design work'
			],
			'pt-BR': [
				'Experiência comprovada como Level Designer',
				'Forte compreensão de princípios de level design (fluxo, ritmo, guia do jogador)',
				'Experiência com Unity na construção de cenas (ProBuilder ou ferramentas similares)',
				'Capacidade de fazer grayboxing e prototipação rápida e iterativa',
				'Portfólio demonstrando trabalhos de level design'
			]
		},
		niceToHaves: {
			en: [
				'Knowledge of lighting and composition in Unity',
				'Experience with level design tools',
				'Experience with version control (Git)',
				'Basic 3D modeling skills for quick prototyping',
				'Understanding of game balancing and difficulty curves'
			],
			'pt-BR': [
				'Conhecimento de iluminação e composição em Unity',
				'Experiência com ferramentas de level design',
				'Experiência com controle de versão (Git)',
				'Habilidades básicas de modelagem 3D para prototipação rápida',
				'Compreensão de balanceamento de jogo e curvas de dificuldade'
			]
		},
		applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSe0h7Ik5dlPiNPwW2eUIdXNMswwaJ9TZSjVk3gSDwi7wUV0vA/viewform?usp=header',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese', 'Estimated Time: Fulltime 40h/week'],
			'pt-BR': ['Remoto', 'Contrato PJ', 'Português', 'Tempo Estimado: Fulltime 40h/semana']
		},
		postedDate: '2024-11-11'
	},
	{
		id: '3d-artist-generalist',
		title: {
			en: 'Generalist 3D Artist (Stylized Low-Poly)',
			'pt-BR': 'Artista 3D Generalista (Estilizado Low-Poly)'
		},
		description: {
			en: 'We are looking for a versatile Generalist 3D Artist to create stylized, low-poly visual assets for our game, from creatures and characters to environment props and level decoration. We\'re aiming for a charming, stylized aesthetic rather than photorealistic visuals.',
			'pt-BR': 'Procuramos um(a) Artista 3D Generalista versátil para criar assets visuais estilizados e low-poly para o nosso jogo, desde criaturas e personagens até props de cenário e decoração de níveis. Buscamos uma estética estilizada e charmosa, não realista.'
		},
		responsibilities: {
			en: [
				'Model and texture stylized low-poly characters, creatures, and items',
				'Model and texture stylized low-poly environment assets and props for level decoration',
				'Create rigs (skeletons) and skinning for characters and creatures',
				'Animate movement cycles (walk, run, sleep, etc.) and character actions',
				'Work with the technical team to ensure assets are optimized and work correctly in-game',
				'Collaborate with the Level Designer to provide assets needed for level construction'
			],
			'pt-BR': [
				'Modelar e texturizar personagens, criaturas e itens estilizados low-poly',
				'Modelar e texturizar assets de cenário e props estilizados low-poly para decoração de níveis',
				'Criar rigs (esqueletos) e skinning para personagens e criaturas',
				'Animar ciclos de movimento (andar, correr, dormir, etc.) e ações de personagens',
				'Trabalhar com a equipe técnica para garantir que os assets estejam otimizados e funcionem corretamente no jogo',
				'Colaborar com o Level Designer para fornecer assets necessários para construção de níveis'
			]
		},
		requirements: {
			en: [
				'Strong and diverse portfolio demonstrating stylized low-poly character, creature, and environment modeling',
				'Solid experience in low-poly 3D modeling and texturing (Blender, Maya, or similar)',
				'Experience in rigging and skinning',
				'Solid 3D animation skills (preferably familiar with animation principles)',
				'Knowledge of texturing for stylized assets (preferably Substance Painter or similar)',
				'Understanding of game asset optimization (poly count, texture resolution, draw calls, etc.)'
			],
			'pt-BR': [
				'Portfólio forte e diverso demonstrando modelagem estilizada low-poly de personagens, criaturas e cenários',
				'Experiência sólida em modelagem 3D low-poly e texturização (Blender, Maya ou similar)',
				'Experiência em rigging e skinning',
				'Habilidade sólida em animação 3D (preferência por conhecer os princípios de animação)',
				'Conhecimento em texturização para assets estilizados (preferência por Substance Painter ou similar)',
				'Compreensão de otimização de assets para jogos (contagem de polígonos, resolução de texturas, draw calls, etc.)'
			]
		},
		niceToHaves: {
			en: [
				'Experience rigging/animating quadrupeds or creatures',
				'Knowledge of Unity\'s export/import pipeline',
				'Experience with version control (Git)',
				'Knowledge of asset retopology for games',
				'Knowledge of LOD creation',
				'Knowledge of rendering optimizations like texture batching',
				'Experience with modular asset creation for environments',
			],
			'pt-BR': [
				'Experiência em rigging/animação de quadrúpedes ou criaturas',
				'Conhecimento do pipeline de exportação/importação na Unity',
				'Experiência com controle de versão (Git)',
				'Conhecimento em retopologia de assets para jogos',
				'Conhecimento em criação de LODs',
				'Conhecimento de otimizações de rendering como texture batching',
				'Experiência com criação de assets modulares para ambientes',
			]
		},
		applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeTKlssXrDeb2q1aty44BjPcnVbCU79zOJef-QUzZkW-hxSQQ/viewform?usp=header',
		active: true,
		jobDetails: {
			en: ['Remote', 'Freelance', 'Portuguese', 'Estimated Time: Fulltime 40h/week'],
			'pt-BR': ['Remoto', 'Contrato PJ', 'Português', 'Tempo Estimado: Fulltime 40h/semana']
		},
		postedDate: '2024-11-11'
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