'use client';

import { useState } from 'react';
import NewsletterForm from './NewsletterForm';
import PreferencesModal from './PreferencesModal';

// Inline i18n strings to avoid coupling with server-side translation system.
// These match the keys in messages/en.json and messages/pt-BR.json.
const strings = {
	en: {
		title: 'Stay in the Loop',
		subtitle: 'Be notified when the Steam page goes live!',
		placeholder: 'your@email.com',
		submit: 'Stay in the loop',
		submitting: 'Subscribing...',
		invalidEmail: 'Please enter a valid email address.',
		error: 'Something went wrong. Please try again.',
		successTitle: "You're in!",
		successMessage: 'Check your inbox to confirm your subscription.',
		preferencesTitle: 'Extras ✨',
		preferencesDescription: "Choose which lists you'd like to join:",
		studioLabel: 'Studio News',
		studioDescription: 'Updates about Made in Bugs and all our projects.',
		devlogLabel: 'Devlog',
		devlogDescription: 'Behind-the-scenes and tips for other game devs.',
		preferencesConfirm: 'Yes, sign me up!',
		preferencesDismiss: 'No thanks',
		done: 'All set! Check your inbox to confirm.',
	},
	'pt-BR': {
		title: 'Fique por Dentro',
		subtitle: 'Seja avisado quando a página da Steam lançar!',
		placeholder: 'seu@email.com',
		submit: 'Ficar por dentro',
		submitting: 'Inscrevendo...',
		invalidEmail: 'Por favor, insira um email válido.',
		error: 'Algo deu errado. Tente novamente.',
		successTitle: 'Obrigado!',
		successMessage: 'Você receberá um e-mail para confirmar sua inscrição.',
		preferencesTitle: 'Extras ✨',
		preferencesDescription: 'Escolha quais listas você gostaria de participar:',
		studioLabel: 'Novidades do Estúdio',
		studioDescription: 'Atualizações sobre a Made in Bugs e nossos projetos.',
		devlogLabel: 'Devlog',
		devlogDescription: 'Bastidores e dicas para devs de jogos.',
		preferencesConfirm: 'Sim, quero!',
		preferencesDismiss: 'Não, obrigado',
		done: 'Tudo certo! Verifique sua caixa de entrada para confirmar.',
	},
};

interface NewsletterSectionProps {
	locale: string;
}

export default function NewsletterSection({ locale }: NewsletterSectionProps) {
	const [flowState, setFlowState] = useState<'idle' | 'success' | 'done'>('idle');
	const [subscribedEmail, setSubscribedEmail] = useState('');

	const t = strings[locale as 'en' | 'pt-BR'] || strings.en;

	function handleSubscribeSuccess(email: string) {
		setSubscribedEmail(email);
		setFlowState('success');
	}

	function handleModalClose() {
		setFlowState('done');
	}

	return (
		<>
			<div className="content-card space-y-4">
				<p className="font-body text-gray-600">
					{t.subtitle}
				</p>

				<div className="w-full">
					{flowState === 'done' ? (
						<p className="font-body text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
							{t.done}
						</p>
					) : (
						<NewsletterForm
							locale={locale}
							t={t}
							onSuccess={handleSubscribeSuccess}
						/>
					)}
				</div>
			</div>

			{/* Preferences modal overlay */}
			{flowState === 'success' && (
				<PreferencesModal
					email={subscribedEmail}
					t={t}
					onClose={handleModalClose}
				/>
			)}
		</>
	);
}
