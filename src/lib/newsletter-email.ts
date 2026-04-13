// Confirmation email HTML template for newsletter double opt-in.
// Inline CSS for maximum email client compatibility.

const SITE_URL = 'https://www.madeinbugs.com.br';

interface ConfirmationEmailParams {
	confirmUrl: string;
	locale: 'pt-BR' | 'en';
}

const strings = {
	en: {
		subject: 'Confirm your subscription — Made in Bugs',
		preheader: 'One click to confirm your subscription to Asumi news.',
		heading: 'Confirm your email',
		body: 'Hi there! This is to prevent spammers and bots. Click the button below to confirm your subscription.',
		button: 'Confirm',
		expire: 'This link expires in 7 days.',
		ignore: "If you didn't sign up, you can safely ignore this email.",
		footer: '© 2026 Made in Bugs. All rights reserved.',
		unsubscribe: 'If you no longer wish to receive emails, simply ignore this message.',
	},
	'pt-BR': {
		subject: 'Confirme sua inscrição — Made in Bugs',
		preheader: 'Um clique para confirmar sua inscrição nas novidades do Asumi.',
		heading: 'Confirme seu email',
		body: 'Olá! Isso é para evitar spam e bots. Clique no botão abaixo para confirmar sua inscrição.',
		button: 'Confirmar',
		expire: 'Este link expira em 7 dias.',
		ignore: 'Se você não se inscreveu, pode ignorar este email.',
		footer: '© 2026 Made in Bugs. Todos os direitos reservados.',
		unsubscribe: 'Se não deseja receber emails, basta ignorar esta mensagem.',
	},
};

export function getConfirmationEmailSubject(locale: 'pt-BR' | 'en'): string {
	return strings[locale].subject;
}

export function buildConfirmationEmail({ confirmUrl, locale }: ConfirmationEmailParams): string {
	const t = strings[locale];
	const logoUrl = `${SITE_URL}/assets/mail/MiB-Mail-Logo.png`;
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

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header: logo on left, banner as background -->
<tr>
<td style="padding:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<!-- Banner image (full width) -->
<td style="padding:0;line-height:0;font-size:0;">
<img src="${bannerUrl}" alt="Made in Bugs" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;"/>
</td>
</tr>
<!-- Logo row below banner, left-aligned -->
<tr>
<td style="padding:16px 24px 12px;background-color:#ffffff;">
<img src="${logoUrl}" alt="Made in Bugs" height="40" style="display:block;height:40px;width:auto;border:0;"/>
</td>
</tr>
</table>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:8px 28px 32px;">
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
<td style="padding:20px 28px;background-color:#f9f9f9;border-top:1px solid #eeeeee;">
<p style="margin:0 0 8px;font-size:12px;color:#999999;text-align:center;">${t.unsubscribe}</p>
<p style="margin:0;font-size:12px;color:#999999;text-align:center;">${t.footer}</p>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
