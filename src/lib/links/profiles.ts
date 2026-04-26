import type { Profile } from './types';

export const profiles = {
	studio: {
		name: { 'pt-BR': 'Made in Bugs', en: 'Made in Bugs' },
		bio: {
			'pt-BR': 'Estúdio indie brasileiro de jogos 🪲',
			en: 'Brazilian indie game studio 🪲',
		},
		avatar: '/assets/links/mib-avatar.webp',
	},
	asumi: {
		name: { 'pt-BR': 'Asumi', en: 'Asumi' },
		bio: {
			'pt-BR': 'Um cozy game sobre cuidar da fauna brasileira',
			en: 'A cozy game about caring for Brazilian wildlife',
		},
		avatar: '/assets/links/asumi-avatar.webp',
	},
} as const satisfies Record<'studio' | 'asumi', Profile>;

export type ProfileKey = keyof typeof profiles;
