import type { LinkItem } from './types';

export const links: LinkItem[] = [
	{
		id: 'polaroid-awards',
		title: {
			'pt-BR': 'Competição de Melhor Fotografia',
			en: 'Polaroid Awards',
		},
		description: {
			'pt-BR': 'Vote nas melhores fotos!',
			en: 'Vote on the best pictures!',
		},
		url: '/picture-contest/voting',
		iconName: 'camera',
		featured: true,
		variant: 'rainbow',
		category: 'other',
		scope: 'both',
	},
	{
		id: 'asumi-game',
		title: { 'pt-BR': 'Asumi: Little Ones', en: 'Asumi: Little Ones' },
		description: {
			'pt-BR': 'Conheça nosso jogo principal',
			en: 'Check out our flagship game',
		},
		url: '/projects/asumi',
		iconName: 'gamepad',
		featured: true,
		category: 'game',
		scope: 'studio',
	},
	{
		id: 'newsletter',
		title: { 'pt-BR': 'Bugsletter', en: 'Bugsletter' },
		description: {
			'pt-BR': 'Novidades do estúdio direto no seu e-mail',
			en: 'Studio updates straight to your inbox',
		},
		url: '/bugsletter',
		iconName: 'newsletter',
		variant: 'buzzy',
		category: 'newsletter',
		scope: 'both',
	},
	{
		id: 'discord',
		title: { 'pt-BR': 'Discord', en: 'Discord' },
		description: {
			'pt-BR': 'Entre na nossa comunidade',
			en: 'Join our community',
		},
		url: 'https://go.madeinbugs.com.br/links-discord',
		iconName: 'discord',
		variant: 'discord',
		category: 'community',
		scope: 'both',
	},
	{
		id: 'site',
		title: { 'pt-BR': 'Site do estúdio', en: 'Studio website' },
		url: '/',
		iconName: 'globe',
		category: 'other',
		scope: 'asumi',
	},
];
