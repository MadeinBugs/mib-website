export type PictureContestLocale = 'pt-BR' | 'en';

export const pictureContestTranslations = {
	'pt-BR': {
		// Login
		loginTitle: 'Login de Administrador',
		loginSubtitle: 'Acesso restrito à equipe',
		emailLabel: 'Email',
		emailPlaceholder: 'voce@madeinbugs.com.br',
		passwordLabel: 'Senha',
		passwordPlaceholder: '••••••••',
		signIn: 'Entrar',
		signingIn: 'Entrando...',
		loginError: 'Email ou senha inválidos',

		// Layout
		headerTitle: 'Photo Contest',
		signOut: 'Sair',

		// Gallery
		galleryTitle: 'Galeria do Photo Contest',
		sessionsCount: (count: number) => `${count} sessões`,
		picturesCount: (count: number) => `${count} fotos`,
		noSessions: 'Nenhuma sessão ainda',
		back: 'Voltar',
		booth: 'Booth',
		takenAt: 'Tirada em',
		loading: 'Carregando...',
		metadata: 'Metadados',
		logout: 'Sair',

		// Session
		sessionTitle: (uniqueId: string) => `Sessão ${uniqueId}`,
		noPictures: 'Nenhuma foto nesta sessão',
	},
	en: {
		// Login
		loginTitle: 'Admin Login',
		loginSubtitle: 'Restricted access',
		emailLabel: 'Email',
		emailPlaceholder: 'you@madeinbugs.com',
		passwordLabel: 'Password',
		passwordPlaceholder: '••••••••',
		signIn: 'Sign in',
		signingIn: 'Signing in...',
		loginError: 'Invalid email or password',

		// Layout
		headerTitle: 'Photo Contest',
		signOut: 'Sign out',

		// Gallery
		galleryTitle: 'Photo Contest Gallery',
		sessionsCount: (count: number) => `${count} sessions`,
		picturesCount: (count: number) => `${count} pictures`,
		noSessions: 'No sessions yet',
		back: 'Back',
		booth: 'Booth',
		takenAt: 'Taken at',
		loading: 'Loading...',
		metadata: 'Metadata',
		logout: 'Sign out',

		// Session
		sessionTitle: (uniqueId: string) => `Session ${uniqueId}`,
		noPictures: 'No pictures in this session',
	},
};

export type PictureContestTranslations = typeof pictureContestTranslations['pt-BR'];
