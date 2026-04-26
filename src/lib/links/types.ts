export type Locale = 'en' | 'pt-BR';

export type LocalizedString = {
	'pt-BR': string;
	en: string;
};

export type LinkCategory =
	| 'social'
	| 'game'
	| 'newsletter'
	| 'community'
	| 'other';

export type IconName =
	| 'instagram'
	| 'tiktok'
	| 'youtube'
	| 'discord'
	| 'bluesky'
	| 'x'
	| 'newsletter'
	| 'gamepad'
	| 'globe'
	| 'mail';

export type LinkScope = 'studio' | 'asumi' | 'both';

export type LinkItem = {
	id: string;
	title: LocalizedString;
	description?: LocalizedString;
	url: string;
	iconName: IconName;
	featured?: boolean;
	category?: LinkCategory;
	scope: LinkScope;
};

export type Profile = {
	name: LocalizedString;
	bio: LocalizedString;
	avatar: string;
};
