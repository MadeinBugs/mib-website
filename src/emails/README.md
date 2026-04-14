# Email System — Made in Bugs

This directory contains the markdown-based email rendering system used for transactional emails (welcome, confirmations, announcements, etc.).

## Directory Structure

```
src/emails/
├── templates/
│   └── base.ts              # Base HTML template (header + footer)
├── content/
│   ├── welcome.pt-BR.md     # Welcome email — Portuguese
│   ├── welcome.en.md        # Welcome email — English
│   └── (add new emails here)
└── render.ts                # renderEmail() — the rendering engine
```

## Creating a New Email

### 1. Create the content files

Create one `.md` file per locale in `src/emails/content/`:

```
my-email.pt-BR.md
my-email.en.md
```

### 2. Add frontmatter

Every email file must start with YAML-like frontmatter between `---` delimiters:

```markdown
---
subject: "🎮 Your email subject here"
preheader: "Short preview text shown in inbox list (optional)"
---

# Your email content starts here

Write your content in standard Markdown...
```

| Field       | Required | Description                                         |
| ----------- | -------- | --------------------------------------------------- |
| `subject`   | Yes      | Email subject line. Supports emojis.                |
| `preheader` | No       | Preview text shown in inbox list views (Gmail, etc). |

### 3. Write the body

The body supports standard Markdown:

- **Headings** (`#`, `##`, `###`) — rendered with white text, proper sizing
- **Bold** (`**text**`) — white, bold
- **Italic** (`*text*`) — gray, italic
- **Links** (`[text](url)`) — teal (#00c69c), underlined
- **Unordered lists** (`- item`)
- **Ordered lists** (`1. item`)
- **Blockquotes** (`> text`) — left border accent in teal
- **Images** (`![alt](url)`) — max-width, rounded corners
- **Horizontal rules** (`---`)
- **Inline code** (`` `code` ``) — dark background pill

All elements get **inline CSS automatically** via the custom `marked` renderer — no manual styling needed.

### 4. Inline HTML for styled buttons

Markdown doesn't support styled buttons. Use inline HTML:

```markdown
Some text above the button.

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background-color:#00c69c;border-radius:8px;">
<a href="https://example.com" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">Button Text</a>
</td>
</tr>
</table>

Some text below the button.
```

> **Why a `<table>` instead of a `<div>`?** Outlook doesn't support `border-radius`, `display:inline-block`, or proper padding on `<a>` tags. The table-based button is the only approach that renders correctly across all major email clients.

### 5. Using images

```markdown
![Asumi banner](https://www.madeinbugs.com.br/assets/projects/asumi/banner.png)
```

Images are rendered as block elements with `max-width:100%` and rounded corners.

> **Important:** Always use absolute URLs for images. Email clients fetch images from the live server — relative paths won't work.

## Using the Rendering Engine

### `renderEmail(templateName, locale, variables?)`

```typescript
import { renderEmail } from '../emails/render';

const { subject, htmlContent, textContent } = renderEmail('welcome', 'pt-BR');
```

**Parameters:**

| Parameter      | Type                          | Description                                                |
| -------------- | ----------------------------- | ---------------------------------------------------------- |
| `templateName` | `string`                      | Name of the email (matches filename without locale/ext)    |
| `locale`       | `'pt-BR' \| 'en'`            | Language to render                                         |
| `variables`    | `Record<string, string>`      | Optional. Replaces `{{key}}` in the markdown before parsing |

**Returns:**

| Field         | Type     | Description                            |
| ------------- | -------- | -------------------------------------- |
| `subject`     | `string` | From frontmatter                       |
| `htmlContent` | `string` | Full HTML email with inline CSS        |
| `textContent` | `string` | Plain text version (auto-generated)    |

### Template variables

If your email needs dynamic values, use `{{variableName}}` in the markdown:

```markdown
---
subject: "Your order #{{orderId}}"
---

Hi **{{name}}**, your order has been confirmed.
```

```typescript
renderEmail('order-confirmation', 'en', {
  orderId: '12345',
  name: 'John',
});
```

## Sending an Email Programmatically

### Via API Route (transactional, to one recipient)

```typescript
import { renderEmail } from '../../../emails/render';
import { sendTransactionalEmail } from '../../../lib/brevo';

const { subject, htmlContent, textContent } = renderEmail('welcome', 'pt-BR');

await sendTransactionalEmail({
  to: [{ email: 'user@example.com' }],
  subject,
  htmlContent,
  textContent,
  sender: { name: 'Made in Bugs', email: 'noreply@madeinbugs.com.br' },
});
```

### Sending a Campaign (bulk, to a list)

For sending to all subscribers at once, use the **Brevo dashboard**:

1. Go to [app.brevo.com](https://app.brevo.com) → **Campaigns** → **Create**
2. Use `renderEmail()` locally to generate the HTML (see preview section below)
3. In Brevo's editor, choose "Paste your code" and paste the `htmlContent`
4. Select target list(s): Asumi (5), Studio (6), Devlog (7)
5. Add segment condition: `CONFIRMED is true`
6. Send or schedule

## Previewing Emails Locally

Create a temporary API route to preview rendered emails in your browser:

```typescript
// src/app/api/dev/preview-email/route.ts (DELETE BEFORE PRODUCTION)
import { NextRequest, NextResponse } from 'next/server';
import { renderEmail } from '../../../../emails/render';

export async function GET(request: NextRequest) {
  const template = request.nextUrl.searchParams.get('template') || 'welcome';
  const locale = request.nextUrl.searchParams.get('locale') === 'pt-BR' ? 'pt-BR' : 'en';

  const { htmlContent } = renderEmail(template, locale as 'pt-BR' | 'en');

  return new NextResponse(htmlContent, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
```

Then visit: `http://localhost:3000/api/dev/preview-email?template=welcome&locale=pt-BR`

> **Remember to delete this route before deploying to production.**

## Examples

### Simple text email

```markdown
---
subject: "Quick update from Made in Bugs"
---

# Hey! 👋

Just a quick note to let you know we're working on something new.

Stay tuned,
**Made in Bugs Team**
```

### Email with styled button

```markdown
---
subject: "🎮 Asumi is now on Steam!"
preheader: "Wishlist now and be the first to play."
---

# The wait is over! 🎉

**Asumi** is now live on Steam. Add it to your wishlist to get notified on launch day.

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center" style="background-color:#00c69c;border-radius:8px;">
<a href="https://store.steampowered.com/app/asumi" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">Wishlist on Steam</a>
</td>
</tr>
</table>

> We'll only email you when it really matters.

See you in-game,
**Made in Bugs Team**
```

### Email with image

```markdown
---
subject: "New trailer revealed!"
---

# Check out the new Asumi trailer 🎬

![Asumi Trailer Thumbnail](https://www.madeinbugs.com.br/assets/projects/asumi/banner.png)

We just dropped a brand new gameplay trailer for **Asumi**. Watch it now:

- [Watch on YouTube](https://youtube.com/watch?v=example)

See you soon,
**Made in Bugs Team**
```
