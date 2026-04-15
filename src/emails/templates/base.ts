// Base HTML email template with header (banner + logo) and footer.
// All CSS is inline for maximum email client compatibility.

const SITE_URL = 'https://www.madeinbugs.com.br';
const LOGO_URL = `${SITE_URL}/assets/mail/MiB-Mail-Logo2.png`;
const BANNER_URL = `${SITE_URL}/assets/mail/MiB-Mail-Banner1.png`;
const SOCIAL_URL = `${SITE_URL}/assets/social-media`;

// Social links in footer — update URLs to match the studio's actual handles
const SOCIAL_LINKS = [
	{ name: 'Instagram', href: 'https://www.instagram.com/madeinbugs/', icon: `${SOCIAL_URL}/instagram.png` },
	{ name: 'YouTube', href: 'https://www.youtube.com/@madeinbugs', icon: `${SOCIAL_URL}/youtube.png` },
	{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/made-in-bugs', icon: `${SOCIAL_URL}/linkedin.png` },
	{ name: 'X', href: 'https://x.com/madeinbugs', icon: `${SOCIAL_URL}/x.png` },
	{ name: 'Bluesky', href: 'https://bsky.app/profile/madeinbugs.com.br', icon: `${SOCIAL_URL}/bluesky.png` },

];

interface BaseTemplateParams {
	body: string;
	preheader?: string;
	locale: 'pt-BR' | 'en';
	unsubscribeUrl?: string;
}

const footerStrings = {
	en: {
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'You received this because you subscribed to Made in Bugs updates.',
		unsubscribePrompt: "Don't want to receive emails?",
		unsubscribeLink: 'Unsubscribe',
		rights: '© 2026 Made in Bugs. All rights reserved.',
	},
	'pt-BR': {
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'Você recebeu este email porque se inscreveu para novidades da Made in Bugs.',
		unsubscribePrompt: 'Não quer mais receber emails?',
		unsubscribeLink: 'Cancelar inscrição',
		rights: '© 2026 Made in Bugs. Todos os direitos reservados.',
	},
};

export function wrapInBaseTemplate({ body, preheader, locale, unsubscribeUrl }: BaseTemplateParams): string {
	const f = footerStrings[locale];

	const preheaderHtml = preheader
		? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>`
		: '';

	return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<!--[if mso]>
<style>table,td{font-family:Arial,sans-serif!important}</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
${preheaderHtml}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:40px 16px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#f7fff0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header: Banner -->
<tr>
<td style="padding:0;line-height:0;font-size:0;">
<img src="${BANNER_URL}" alt="Made in Bugs" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;"/>
</td>
</tr>

<!-- Header: Logo (overlaps banner) -->
<tr>
<td style="padding:0 24px 4px;background-color:#f7fff0;">
<div style="margin-top:-48px;">
<img src="${LOGO_URL}" alt="Made in Bugs" height="96" style="display:block;height:96px;width:auto;border:0;"/>
</div>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:0 28px 32px;">
${body}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:24px 28px;background-color:#edf7e4;border-top:1px solid #d4e8c8;">

<!-- Social Icons -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
${SOCIAL_LINKS.map(({ name, href, icon }) => `<td style="padding:0 6px;">
<a href="${href}" target="_blank" title="${name}" style="display:inline-block;line-height:0;font-size:12px;color:#666666;text-decoration:none;">
<img src="${icon}" alt="${name}" width="24" height="24" style="display:block;width:24px;height:24px;border:0;opacity:0.7;"/>
</a>
</td>`).join('\n')}
</tr>
</table>

<p style="margin:0 0 8px;font-size:13px;color:#666666;text-align:center;">${f.studio}</p>
<p style="margin:0 0 8px;font-size:11px;color:#888888;text-align:center;">${f.unsubscribe}</p>
${unsubscribeUrl ? `<p style="margin:0 0 8px;font-size:11px;color:#888888;text-align:center;">${f.unsubscribePrompt} <a href="${unsubscribeUrl}" target="_blank" style="color:#666666;text-decoration:underline;">${f.unsubscribeLink}</a></p>` : ''}
<p style="margin:0;font-size:11px;color:#888888;text-align:center;">${f.rights}</p>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
