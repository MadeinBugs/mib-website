// Confirmation email HTML template for newsletter double opt-in.
// Inline CSS for maximum email client compatibility.

const SITE_URL = 'https://www.madeinbugs.com.br';
const SOCIAL_URL = `${SITE_URL}/assets/social-media`;

const SOCIAL_LINKS = [
	{ name: 'Instagram', href: 'https://www.instagram.com/madeinbugs/', icon: `${SOCIAL_URL}/instagram.png` },
	{ name: 'YouTube', href: 'https://www.youtube.com/@madeinbugs', icon: `${SOCIAL_URL}/youtube.png` },
	{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/madeinbugs', icon: `${SOCIAL_URL}/linkedin.png` },
	{ name: 'X', href: 'https://x.com/madeinbugs', icon: `${SOCIAL_URL}/x.png` },
	{ name: 'Bluesky', href: 'https://bsky.app/profile/madeinbugs.com.br', icon: `${SOCIAL_URL}/bluesky.png` },
];

interface ConfirmationEmailParams {
	confirmUrl: string;
	locale: 'pt-BR' | 'en';
}

const strings = {
	en: {
		subject: 'Confirm your subscription — Made in Bugs',
		preheader: 'One click to confirm your subscription to Asumi news.',
		heading: 'Confirm your email',
		body: 'Hi there! Click the button below to confirm your subscription.',
		button: 'Confirm',
		expire: 'This link expires in 7 days.',
		ignore: "If you didn't sign up, you can safely ignore this email.",
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'You received this because you subscribed to Made in Bugs updates.',
		unsubscribePrompt: 'If you no longer wish to receive emails, simply ignore this message.',
		rights: '© 2026 Made in Bugs. All rights reserved.',
	},
	'pt-BR': {
		subject: 'Confirme sua inscrição — Made in Bugs',
		preheader: 'Um clique para confirmar sua inscrição nas novidades do Asumi.',
		heading: 'Confirme seu email',
		body: 'Oiê! Clique no botão abaixo para confirmar sua inscrição.',
		button: 'Confirmar',
		expire: 'Este link expira em 7 dias.',
		ignore: 'Se você não se inscreveu, pode ignorar este email.',
		studio: 'Made in Bugs · Bugsletter',
		unsubscribe: 'Você recebeu este email porque se inscreveu para novidades da Made in Bugs.',
		unsubscribePrompt: 'Se não deseja receber emails, basta ignorar esta mensagem.',
		rights: '© 2026 Made in Bugs. Todos os direitos reservados.',
	},
};

export function getConfirmationEmailSubject(locale: 'pt-BR' | 'en'): string {
	return strings[locale].subject;
}

export function buildConfirmationEmail({ confirmUrl, locale }: ConfirmationEmailParams): string {
	const t = strings[locale];
	const logoUrl = `${SITE_URL}/assets/mail/MiB-Mail-Logo2.png`;
	const bannerUrl = `${SITE_URL}/assets/mail/MiB-Mail-Banner1.png`;

	return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${t.subject}</title>
<!--[if mso]>
<style>table,td{font-family:Arial,sans-serif!important}</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<!-- Preheader (hidden text for inbox preview) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${t.preheader}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:40px 16px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#f7fff0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header: Banner -->
<tr>
<td style="padding:0;line-height:0;font-size:0;">
<img src="${bannerUrl}" alt="Made in Bugs" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;"/>
</td>
</tr>

<!-- Header: Logo (overlaps banner) -->
<tr>
<td style="padding:0 24px 4px;background-color:#f7fff0;">
<div style="margin-top:-48px;">
<img src="${logoUrl}" alt="Made in Bugs" height="96" style="display:block;height:96px;width:auto;border:0;"/>
</div>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:0 28px 32px;">
<h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1a1a;">${t.heading}</h2>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a4a4a;">${t.body}</p>

<!-- CTA Button -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
<tr>
<td align="center" style="background-color:#00c69c;border-radius:8px;">
<a href="${confirmUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${t.button}</a>
</td>
</tr>
</table>

<p style="margin:0 0 8px;font-size:13px;color:#888888;">${t.expire}</p>
<p style="margin:0;font-size:13px;color:#888888;">${t.ignore}</p>
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

<p style="margin:0 0 8px;font-size:13px;color:#666666;text-align:center;">${t.studio}</p>
<p style="margin:0 0 8px;font-size:11px;color:#888888;text-align:center;">${t.unsubscribe}</p>
<p style="margin:0 0 8px;font-size:11px;color:#888888;text-align:center;">${t.unsubscribePrompt}</p>
<p style="margin:0;font-size:11px;color:#888888;text-align:center;">${t.rights}</p>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
