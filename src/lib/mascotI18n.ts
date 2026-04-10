export const mascotTranslations = {
	'pt-BR': {
		// Login
		loginTitle: 'Faça seu Mascote',
		loginSubtitle: 'Entre para customizar seu mascote',
		emailLabel: 'Email',
		emailPlaceholder: 'voce@madeinbugs.com.br',
		passwordLabel: 'Senha',
		passwordPlaceholder: '••••••••',
		signIn: 'Entrar',
		signingIn: 'Entrando...',
		noAccount: 'Não tem uma conta?',
		registerLink: 'Cadastre-se com código de convite',

		// Register
		registerTitle: 'Junte-se ao Time',
		registerSubtitle: 'Crie sua conta com um código de convite',
		inviteCodeLabel: 'Código de Convite',
		inviteCodePlaceholder: 'XXXX-XXXX-XXXX',
		displayNameLabel: 'Nome de Exibição',
		displayNamePlaceholder: 'Seu nome',
		passwordMinLength: 'Mínimo 6 caracteres',
		createAccount: 'Criar Conta',
		creatingAccount: 'Criando conta...',
		hasAccount: 'Já tem uma conta?',
		signInLink: 'Entrar',

		// Layout header
		headerTitle: 'Estúdio Sisyphus',
		signOut: 'Sair',

		// Editor
		editorTitle: 'MiB  Paint',
		editorWelcome: (name: string) => `Bem-vindo(a), ${name}!`,
		editorWelcomeAnon: 'Bem-vindo(a)!',
		editorSubtitle: (year: number) => `Crie sua versão única do Sísifo para o pôster do time ${year}.`,
		saved: '✓ Salvo',
		saving: 'Salvando...',
		saveError: '⚠ Falha ao salvar — guardado localmente',
		ready: 'Pronto',
		editorPlaceholder: '🎨 Editor de mascote em breve!',
		editorPlaceholderSub: 'Ferramentas de customização aparecerão aqui.',

		// Commentary
		commentaryLabel: 'Seus comentários',
		commentaryPlaceholder: 'Descreva seu mascote ou adicione comentários...',
		commentaryCharCount: (n: number, max: number) => `${n}/${max}`,

		// Gallery
		galleryTitle: 'Galeria do Time',
		galleryLink: 'Galeria',
		galleryEmpty: 'Nenhuma customização encontrada para este ano.',
		galleryDownloadPng: 'Baixar PNG',
		galleryDownloadJson: 'Baixar JSON',
		galleryLastUpdated: 'Atualizado',
		galleryNoPreview: 'Sem prévia',
		galleryNoCommentary: 'Sem comentários.',

		// Errors
		unexpectedError: 'Ocorreu um erro inesperado',
		invalidInviteCode: 'Código de convite inválido',
		registrationFailed: 'Falha no cadastro',
	},
	en: {
		// Login
		loginTitle: 'Create your Mascot',
		loginSubtitle: 'Sign in to customize your mascot',
		emailLabel: 'Email',
		emailPlaceholder: 'you@madeinbugs.com',
		passwordLabel: 'Password',
		passwordPlaceholder: '••••••••',
		signIn: 'Sign In',
		signingIn: 'Signing in...',
		noAccount: "Don't have an account?",
		registerLink: 'Register with invite code',

		// Register
		registerTitle: 'Join the Team',
		registerSubtitle: 'Create your account with an invite code',
		inviteCodeLabel: 'Invite Code',
		inviteCodePlaceholder: 'XXXX-XXXX-XXXX',
		displayNameLabel: 'Display Name',
		displayNamePlaceholder: 'Your name',
		passwordMinLength: 'At least 6 characters',
		createAccount: 'Create Account',
		creatingAccount: 'Creating account...',
		hasAccount: 'Already have an account?',
		signInLink: 'Sign in',

		// Layout header
		headerTitle: 'Sisyphus Studio',
		signOut: 'Sign out',

		// Editor
		editorTitle: 'MiB  Paint',
		editorWelcome: (name: string) => `Welcome, ${name}!`,
		editorWelcomeAnon: 'Welcome!',
		editorSubtitle: (year: number) => `Create your unique version of Sisyphus for the ${year} team poster.`,
		saved: '✓ Saved',
		saving: 'Saving...',
		saveError: '⚠ Save failed — stored locally',
		ready: 'Ready',
		editorPlaceholder: '🎨 Mascot editor coming soon!',
		editorPlaceholderSub: 'Customization tools will appear here.',

		// Commentary
		commentaryLabel: 'Your comments',
		commentaryPlaceholder: 'Describe your mascot or add any comments...',
		commentaryCharCount: (n: number, max: number) => `${n}/${max}`,

		// Gallery
		galleryTitle: 'Team Gallery',
		galleryLink: 'Gallery',
		galleryEmpty: 'No customizations found for this year.',
		galleryDownloadPng: 'Download PNG',
		galleryDownloadJson: 'Download JSON',
		galleryLastUpdated: 'Updated',
		galleryNoPreview: 'No preview',
		galleryNoCommentary: 'No comments.',

		// Errors
		unexpectedError: 'An unexpected error occurred',
		invalidInviteCode: 'Invalid invite code',
		registrationFailed: 'Registration failed',
	},
} as const;

export type MascotLocale = keyof typeof mascotTranslations;

// Use a structural type so pt-BR and en are both assignable
export type MascotTranslations = {
	[K in keyof typeof mascotTranslations['en']]: (typeof mascotTranslations['en'])[K] extends (...args: infer A) => infer R
	? (...args: A) => R
	: string;
};
