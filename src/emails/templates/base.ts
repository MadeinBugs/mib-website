// Base HTML email template with header (banner + logo) and footer.
// All CSS is inline for maximum email client compatibility.

const SITE_URL = 'https://www.madeinbugs.com.br';
const LOGO_URL = `${SITE_URL}/assets/mail/MiB-Mail-Logo3.png`;
const BANNER_URL = `${SITE_URL}/assets/mail/MiB-Mail-Banner1.png`;
const SOCIAL_URL = `${SITE_URL}/assets/social-media`;

// Social links in footer — update URLs to match the studio's actual handles
const SOCIAL_LINKS = [
	{ name: 'Instagram', href: 'https://www.instagram.com/madeinbugs/', icon: `${SOCIAL_URL}/instagram.png` },
	{ name: 'YouTube', href: 'https://www.youtube.com/@madeinbugs', icon: `${SOCIAL_URL}/youtube.png` },
	{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/madeinbugs', icon: `${SOCIAL_URL}/linkedin.png` },
	{ name: 'X', href: 'https://x.com/madeinbugs', icon: `${SOCIAL_URL}/x.png` },
	{ name: 'Bluesky', href: 'https://bsky.app/profile/madeinbugs.com.br', icon: `${SOCIAL_URL}/bluesky.png` },

];

interface BaseTemplateParams {
	body: string;
	preheader?: string;
	locale: 'pt-BR' | 'en';
}

const footerStrings = {
	en: {
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'You received this because you subscribed to Made in Bugs updates.',
		rights: '© 2026 Made in Bugs. All rights reserved.',
	},
	'pt-BR': {
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'Você recebeu este email porque se inscreveu para novidades da Made in Bugs.',
		rights: '© 2026 Made in Bugs. Todos os direitos reservados.',
	},
};

export function wrapInBaseTemplate({ body, preheader, locale }: BaseTemplateParams): string {
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
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
${preheaderHtml}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
<tr><td align="center" style="padding:40px 16px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#1a1a2e;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.4);">

<!-- Header: Banner -->
<tr>
<td style="padding:0;line-height:0;font-size:0;">
<img src="${BANNER_URL}" alt="Made in Bugs" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;"/>
</td>
</tr>

<!-- Header: Logo -->
<tr>
<td style="padding:16px 24px 12px;background-color:#1a1a2e;">
<img src="${LOGO_URL}" alt="Made in Bugs" height="56" style="display:block;height:56px;width:auto;border:0;"/>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:8px 28px 32px;">
${body}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:24px 28px;background-color:#12121f;border-top:1px solid #2d2d44;">

<!-- Social Icons -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
${SOCIAL_LINKS.map(({ name, href, icon }) => `<td style="padding:0 6px;">
<a href="${href}" target="_blank" title="${name}" style="display:inline-block;line-height:0;font-size:12px;color:#9ca3af;text-decoration:none;">
<img src="${icon}" alt="${name}" width="24" height="24" style="display:block;width:24px;height:24px;border:0;opacity:0.65;"/>
</a>
</td>`).join('\n')}
</tr>
</table>

<p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-align:center;">${f.studio}</p>
<p style="margin:0 0 8px;font-size:11px;color:#4b5563;text-align:center;">${f.unsubscribe}</p>
<p style="margin:0;font-size:11px;color:#4b5563;text-align:center;">${f.rights}</p>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
