import type { ReactNode } from 'react';

export interface LegalSection {
	title: string;
	content: ReactNode;
}

export interface LegalPageContent {
	en: {
		title: string;
		lastUpdated: string;
		sections: LegalSection[];
	};
	'pt-BR': {
		title: string;
		lastUpdated: string;
		sections: LegalSection[];
	};
}

export interface LegalIndexItem {
	slug: string;
	icon: ReactNode;
	en: { title: string; description: string };
	'pt-BR': { title: string; description: string };
}

export interface LegalIndexContent {
	en: { title: string; subtitle: string };
	'pt-BR': { title: string; subtitle: string };
	items: LegalIndexItem[];
}
