import { redirect } from 'next/navigation';

// Legacy /privacy route — redirect to locale-aware index
export default function PrivacyRedirect() {
	redirect('/pt-BR/privacy');
}
