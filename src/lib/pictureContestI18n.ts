export type PictureContestLocale = 'pt-BR' | 'en';

export const pictureContestTranslations = {
	'pt-BR': {
		// Login (admin)
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

		// Admin gallery
		adminGalleryTitle: 'Galeria Admin',
		sessionsCount: (count: number) => `${count} sessões`,
		noSessions: 'Nenhuma sessão ainda',
		booth: 'Booth',
		galleryViewSessions: 'Sessões',
		galleryViewAll: 'Todas as fotos',
		downloadPicture: 'Baixar foto',
		downloadPolaroid: 'Baixar polaroid',

		// Entry page
		entryTitle: 'Photo Contest',
		entrySubtitle: 'Digite seu código de 5 letras para ver suas fotos',
		codePlaceholder: 'Ex: BUVEV',
		viewPhotos: 'Ver minhas fotos',
		codeNotFound: 'Código não encontrado. Verifique com um membro da equipe.',
		codeInvalid: 'Código inválido. Deve ter 5 letras no padrão correto.',
		searching: 'Buscando...',

		// Player gallery
		playerGalleryTitle: (code: string) => `Fotos de ${code}`,
		picturesCount: (count: number) => `${count} fotos`,
		noPictures: 'Nenhuma foto nesta sessão',
		back: 'Voltar',
		takenAt: 'Tirada em',
		loading: 'Carregando...',
		metadata: 'Metadados',

		// Favorites
		chooseFavorite: 'Escolher como favorita',
		favoriteLabel: 'Favoritar',
		alreadyFavorited: 'Já favoritada',
		favorite: (slot: number) => `Favorita ${slot}`,
		favoriteSlotsFull: 'Você já escolheu sua favorita',
		favoritedCountText: (favorited: number, remaining: number) =>
			`${favorited === 1 ? '1 foto favoritada' : 'Nenhuma foto favoritada'}. ${remaining === 1 ? '1 restante' : 'Nenhuma restante'}`,

		confirmTitle: 'Confirmar escolha',
		confirmMessage: 'Tem certeza? Sua foto será postada no Discord da comunidade para votação. Esta escolha não pode ser desfeita.',
		confirmYes: 'Sim, escolher!',
		confirmCancel: 'Cancelar',
		favoriteSuccess: 'Foto escolhida como favorita!',
		favoriteError: 'Erro ao escolher favorita. Tente novamente.',
		choosing: 'Enviando...',

		// Session detail (admin)
		sessionTitle: (uniqueId: string) => `Sessão ${uniqueId}`,

		// Voting
		votingTitle: 'Votação',
		votingSubtitle: (count: number) => `${count} foto${count !== 1 ? 's' : ''} concorrendo`,
		votingClosed: 'A votação encerrou. Obrigado por participar!',
		noPicturesVoting: 'Ainda não há fotos para votar. Volte em breve!',
		captchaTitle: 'Verificação',
		captchaSubtitle: 'Complete para votar',
		votingLinkText: 'Votar',
		votingLinkPrompt: 'Quer votar nas suas fotos favoritas?',
		alreadyVoted: 'Já votou',
		votesCount: (count: number) => `${count} voto${count !== 1 ? 's' : ''}!`,
		newLabel: 'NOVO',
	},
	en: {
		// Login (admin)
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

		// Admin gallery
		adminGalleryTitle: 'Admin Gallery',
		sessionsCount: (count: number) => `${count} sessions`,
		noSessions: 'No sessions yet',
		booth: 'Booth',
		galleryViewSessions: 'Sessions',
		galleryViewAll: 'All photos',
		downloadPicture: 'Download picture',
		downloadPolaroid: 'Download polaroid',

		// Entry page
		entryTitle: 'Photo Contest',
		entrySubtitle: 'Enter your 5-letter code to see your photos',
		codePlaceholder: 'E.g.: BUVEV',
		viewPhotos: 'View my photos',
		codeNotFound: 'Code not found. Check with a team member.',
		codeInvalid: 'Invalid code. Must be 5 letters in the correct pattern.',
		searching: 'Searching...',

		// Player gallery
		playerGalleryTitle: (code: string) => `Photos by ${code}`,
		picturesCount: (count: number) => `${count} pictures`,
		noPictures: 'No pictures in this session',
		back: 'Back',
		takenAt: 'Taken at',
		loading: 'Loading...',
		metadata: 'Metadata',

		// Favorites
		chooseFavorite: 'Choose as favorite',
		favoriteLabel: 'Favorite',
		alreadyFavorited: 'Already favorited',
		favorite: (slot: number) => `Favorite ${slot}`,
		favoriteSlotsFull: 'You already chose your favorite',
		favoritedCountText: (favorited: number, remaining: number) =>
			`${favorited === 1 ? '1 photo favorited' : 'No photos favorited'}. ${remaining === 1 ? '1 remaining' : 'None remaining'}`,

		confirmTitle: 'Confirm choice',
		confirmMessage: 'Are you sure? Your photo will be posted on the community Discord for voting. This choice cannot be undone.',
		confirmYes: 'Yes, choose!',
		confirmCancel: 'Cancel',
		favoriteSuccess: 'Photo chosen as favorite!',
		favoriteError: 'Error choosing favorite. Try again.',
		choosing: 'Sending...',

		// Session detail (admin)
		sessionTitle: (uniqueId: string) => `Session ${uniqueId}`,

		// Voting
		votingTitle: 'Voting',
		votingSubtitle: (count: number) => `${count} photo${count !== 1 ? 's' : ''} competing`,
		votingClosed: 'Voting has closed. Thank you for participating!',
		noPicturesVoting: 'No photos to vote on yet. Check back soon!',
		captchaTitle: 'Verification',
		captchaSubtitle: 'Complete to vote',
		votingLinkText: 'Vote',
		votingLinkPrompt: 'Want to vote on your favorite photos?',
		alreadyVoted: 'Already voted',
		votesCount: (count: number) => `${count} vote${count !== 1 ? 's' : ''}!`,
		newLabel: 'NEW',
	},
};

export type PictureContestTranslations = typeof pictureContestTranslations['pt-BR'];
