import { redirect } from 'next/navigation';

// Legacy /terms route — redirect to locale-aware index
export default function TermsRedirect() {
	redirect('/pt-BR/terms');
}
