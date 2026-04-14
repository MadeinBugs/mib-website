import { NextRequest, NextResponse } from 'next/server';
import { getContact, updateContact, sendTransactionalEmail } from '../../../../lib/brevo';
import { renderEmail } from '../../../../emails/render';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madeinbugs.com.br';
}

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const token = searchParams.get('token');
	const email = searchParams.get('email');

	const siteUrl = getSiteUrl();

	// Helper to redirect to the confirmation page with a status
	function redirect(locale: string, status: string) {
		return NextResponse.redirect(
			`${siteUrl}/${locale}/newsletter/confirmed?status=${status}`
		);
	}

	if (!token || !email) {
		return redirect('en', 'invalid');
	}

	try {
		const contact = await getContact(email);

		if (!contact) {
			return redirect('en', 'invalid');
		}

		const attrs = contact.attributes;
		const locale = attrs?.LOCALE === 'pt-BR' ? 'pt-BR' : 'en';

		// Already confirmed
		if (attrs?.CONFIRMED === true) {
			return redirect(locale, 'already');
		}

		// Token mismatch
		if (attrs?.CONFIRMATION_TOKEN !== token) {
			return redirect(locale, 'invalid');
		}

		// Check token expiration
		if (attrs?.CONFIRMATION_CREATED_AT) {
			const createdAt = new Date(attrs.CONFIRMATION_CREATED_AT).getTime();
			if (Date.now() - createdAt > TOKEN_TTL_MS) {
				return redirect(locale, 'expired');
			}
		}

		// Confirm the contact
		await updateContact(email, {
			attributes: {
				CONFIRMED: true,
				CONFIRMATION_TOKEN: '',
				CONFIRMATION_CREATED_AT: '',
			},
		});

		// Send welcome email (non-blocking — don't prevent redirect on failure)
		try {
			const { subject, htmlContent, textContent } = renderEmail('welcome', locale);
			await sendTransactionalEmail({
				to: [{ email }],
				subject,
				htmlContent,
				textContent,
				sender: { name: 'Made in Bugs', email: 'noreply@madeinbugs.com.br' },
			});
		} catch (welcomeError) {
			console.error('[newsletter/confirm] Failed to send welcome email:', welcomeError);
		}

		return redirect(locale, 'success');
	} catch (error) {
		console.error('[newsletter/confirm] Error:', error);
		return redirect('en', 'error');
	}
}
