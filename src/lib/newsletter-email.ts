// Confirmation email HTML template for newsletter double opt-in.
// Inline CSS for maximum email client compatibility.

interface ConfirmationEmailParams {
	confirmUrl: string;
	locale: 'pt-BR' | 'en';
}

const strings = {
	en: {
		subject: 'Confirm your subscription — Made in Bugs',
		preheader: 'One click to confirm your subscription to Asumi news.',
		heading: 'Confirm your email',
		body: 'Thanks for signing up! Click the button below to confirm your subscription and start receiving news about Asumi.',
		button: 'Confirm subscription',
		expire: 'This link expires in 48 hours.',
		ignore: "If you didn't sign up, you can safely ignore this email.",
		footer: '© 2026 Made in Bugs. All rights reserved.',
		unsubscribe: 'If you no longer wish to receive emails, simply ignore this message — no further emails will be sent until you confirm.',
	},
	'pt-BR': {
		subject: 'Confirme sua inscrição — Made in Bugs',
		preheader: 'Um clique para confirmar sua inscrição nas novidades do Asumi.',
		heading: 'Confirme seu email',
		body: 'Obrigado por se inscrever! Clique no botão abaixo para confirmar sua inscrição e começar a receber novidades sobre o Asumi.',
		button: 'Confirmar inscrição',
		expire: 'Este link expira em 48 horas.',
		ignore: 'Se você não se inscreveu, pode ignorar este email com segurança.',
		footer: '© 2026 Made in Bugs. Todos os direitos reservados.',
		unsubscribe: 'Se não deseja receber emails, basta ignorar esta mensagem — nenhum outro email será enviado até que você confirme.',
	},
};

export function getConfirmationEmailSubject(locale: 'pt-BR' | 'en'): string {
	return strings[locale].subject;
}

export function buildConfirmationEmail({ confirmUrl, locale }: ConfirmationEmailParams): string {
	const t = strings[locale];

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
<body style="margin:0;padding:0;background-color:#fdf6e3;font-family:Arial,Helvetica,sans-serif;">
<!-- Preheader (hidden text for inbox preview) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${t.preheader}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf6e3;">
<tr><td align="center" style="padding:40px 16px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;border:1px solid #e5d9c3;overflow:hidden;">
<!-- Header -->
<tr>
<td style="background-color:#f59e0b;padding:24px;text-align:center;">
<h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Made in Bugs</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:32px 28px;">
<h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1a1a;">${t.heading}</h2>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a4a4a;">${t.body}</p>

<!-- CTA Button -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
<tr>
<td align="center" style="background-color:#f59e0b;border-radius:8px;">
<a href="${confirmUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${t.button}</a>
</td>
</tr>
</table>

<p style="margin:0 0 8px;font-size:13px;color:#888888;text-align:center;">${t.expire}</p>
<p style="margin:0;font-size:13px;color:#888888;text-align:center;">${t.ignore}</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:20px 28px;background-color:#faf5eb;border-top:1px solid #e5d9c3;">
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
