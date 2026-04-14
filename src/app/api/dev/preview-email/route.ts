// DEV ONLY — delete before production deploy.
// Preview rendered email HTML in the browser.
// Usage: GET /api/dev/preview-email?template=welcome&locale=pt-BR

import { NextRequest, NextResponse } from 'next/server';
import { renderEmail } from '../../../../emails/render';

export async function GET(request: NextRequest) {
	if (process.env.NODE_ENV === 'production') {
		return new NextResponse('Not found', { status: 404 });
	}

	const { searchParams } = request.nextUrl;
	const template = searchParams.get('template') || 'welcome';
	const localeParam = searchParams.get('locale');
	const locale: 'pt-BR' | 'en' = localeParam === 'pt-BR' ? 'pt-BR' : 'en';

	try {
		const { htmlContent, subject } = renderEmail(template, locale);
		return new NextResponse(
			`<!-- Subject: ${subject} -->\n${htmlContent}`,
			{ headers: { 'Content-Type': 'text/html; charset=utf-8' } }
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new NextResponse(`<pre style="font-family:monospace;padding:24px;">Error: ${message}</pre>`, {
			status: 500,
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	}
}
