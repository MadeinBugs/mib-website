// Email rendering engine: reads markdown content files, converts to HTML
// with inline CSS via marked custom renderer, wraps in base template,
// and generates plain text version.

import fs from 'fs';
import path from 'path';
import { Marked, Renderer } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { wrapInBaseTemplate } from './templates/base';
import { generateUnsubscribeUrl } from '../lib/unsubscribe';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RenderResult {
	subject: string;
	htmlContent: string;
	textContent: string;
}

interface ParsedFrontmatter {
	subject: string;
	preheader?: string;
	body: string;
}

// ---------------------------------------------------------------------------
// Frontmatter parser (no gray-matter dependency)
// ---------------------------------------------------------------------------

function parseFrontmatter(raw: string): ParsedFrontmatter {
	const trimmed = raw.trim();

	if (!trimmed.startsWith('---')) {
		return { subject: '', body: trimmed };
	}

	const endIndex = trimmed.indexOf('---', 3);
	if (endIndex === -1) {
		return { subject: '', body: trimmed };
	}

	const frontmatterBlock = trimmed.slice(3, endIndex).trim();
	const body = trimmed.slice(endIndex + 3).trim();

	let subject = '';
	let preheader: string | undefined;

	for (const line of frontmatterBlock.split('\n')) {
		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		// Strip surrounding quotes from value
		const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

		if (key === 'subject') subject = value;
		if (key === 'preheader') preheader = value;
	}

	return { subject, preheader, body };
}

// ---------------------------------------------------------------------------
// Custom marked renderer — inline CSS for email clients
// ---------------------------------------------------------------------------

function createEmailRenderer(): Renderer {
	const renderer = new Renderer();

	renderer.heading = function ({ tokens, depth }) {
		const text = this.parser.parseInline(tokens);
		const styles: Record<number, string> = {
			1: 'color:#1f1f1f;font-size:24px;font-weight:700;line-height:1.3;margin:0 0 16px;',
			2: 'color:#1f1f1f;font-size:20px;font-weight:600;line-height:1.3;margin:24px 0 12px;',
			3: 'color:#333333;font-size:17px;font-weight:600;line-height:1.3;margin:20px 0 10px;',
		};
		const style = styles[depth] || styles[3];
		return `<h${depth} style="${style}">${text}</h${depth}>\n`;
	};

	renderer.paragraph = function ({ tokens }) {
		const text = this.parser.parseInline(tokens);
		// Passthrough: if the paragraph contains only a raw HTML block (e.g. a button table),
		// don't wrap it in a <p> — return it as-is.
		if (text.startsWith('<table') || text.startsWith('<!--')) {
			return `${text}\n`;
		}
		return `<p style="color:#4a4a4a;font-size:15px;line-height:1.6;margin:0 0 16px;">${text}</p>\n`;
	};

	renderer.link = function ({ href, text }) {
		return `<a href="${href}" target="_blank" style="color:#00c69c;text-decoration:underline;font-weight:bold;">${text}</a>`;
	};

	renderer.strong = function ({ text }) {
		return `<strong style="color:#1a1a1a;font-weight:700;">${text}</strong>`;
	};

	renderer.em = function ({ text }) {
		return `<em style="color:#4a4a4a;font-style:italic;">${text}</em>`;
	};

	renderer.list = function ({ items, ordered }) {
		const tag = ordered ? 'ol' : 'ul';
		const body = items.map(item => {
			const itemText = this.listitem(item);
			return itemText;
		}).join('');
		return `<${tag} style="color:#4a4a4a;font-size:15px;line-height:1.6;margin:0 0 16px;padding-left:24px;">${body}</${tag}>\n`;
	};

	renderer.listitem = function (item) {
		let text = this.parser.parse(item.tokens);
		// Strip wrapping <p> tags from list item content to keep items compact
		text = text.replace(/<\/?p[^>]*>/g, '').trim();
		return `<li style="margin:0 0 8px;color:#4a4a4a;">${text}</li>\n`;
	};

	renderer.blockquote = function ({ tokens }) {
		const body = this.parser.parse(tokens);
		return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%;"><tr><td style="border-left:3px solid #00c69c;padding:8px 16px;color:#666666;font-size:14px;line-height:1.5;">${body}</td></tr></table>\n`;
	};

	renderer.image = function ({ href, text }) {
		return `<img src="${href}" alt="${text || ''}" style="display:block;max-width:100%;height:auto;border-radius:8px;margin:0 0 16px;border:0;" />\n`;
	};

	renderer.hr = function () {
		return `<hr style="border:none;border-top:1px solid #d4e8c8;margin:24px 0;" />\n`;
	};

	renderer.codespan = function ({ text }) {
		return `<code style="background-color:#e8f0e0;color:#333333;padding:2px 6px;border-radius:4px;font-size:13px;">${text}</code>`;
	};

	return renderer;
}

// ---------------------------------------------------------------------------
// Plain text generator — strips markdown syntax
// ---------------------------------------------------------------------------

function markdownToPlainText(markdown: string): string {
	return markdown
		// Remove headings markers
		.replace(/^#{1,6}\s+/gm, '')
		// Convert links [text](url) → text (url)
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
		// Remove bold/italic markers
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/__([^_]+)__/g, '$1')
		.replace(/_([^_]+)_/g, '$1')
		// Convert blockquotes
		.replace(/^>\s+/gm, '  ')
		// Convert list items (keep dash)
		.replace(/^[-*]\s+/gm, '- ')
		// Remove images ![alt](url) → [Image: alt]
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[Image: $1]')
		// Remove horizontal rules
		.replace(/^---+$/gm, '---')
		// Collapse multiple blank lines
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

// ---------------------------------------------------------------------------
// Main render function
// ---------------------------------------------------------------------------

const marked = new Marked();

export function renderEmail(
	templateName: string,
	locale: 'pt-BR' | 'en',
	variables?: Record<string, string>,
	recipientEmail?: string
): RenderResult {
	// Read the markdown content file
	const filePath = path.join(
		process.cwd(),
		'src',
		'emails',
		'content',
		`${templateName}.${locale}.md`
	);

	let raw: string;
	try {
		raw = fs.readFileSync(filePath, 'utf-8');
	} catch {
		throw new Error(`Email template not found: ${filePath}`);
	}

	// Process conditional blocks: {{#flag}}content{{/flag}}
	// If variables[flag] is truthy, keep the content; otherwise remove the block.
	if (variables) {
		raw = raw.replace(
			/\{\{#([a-zA-Z_][a-zA-Z0-9_]*)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
			(_, key, content) => (variables[key] ? content : '')
		);
		// Simple value substitutions: {{key}} → value
		for (const [key, value] of Object.entries(variables)) {
			raw = raw.split(`{{${key}}}`).join(value);
		}
	} else {
		// No variables — strip all conditional blocks
		raw = raw.replace(
			/\{\{#([a-zA-Z_][a-zA-Z0-9_]*)\}\}[\s\S]*?\{\{\/\1\}\}/g,
			''
		);
	}

	// Parse frontmatter
	const { subject, preheader, body } = parseFrontmatter(raw);

	if (!subject) {
		throw new Error(`Email template "${templateName}.${locale}.md" is missing a "subject" in frontmatter`);
	}

	// Convert markdown → HTML with inline CSS, then sanitize
	marked.setOptions({ renderer: createEmailRenderer() });
	const rawBodyHtml = marked.parse(body) as string;
	const bodyHtml = DOMPurify.sanitize(rawBodyHtml, {
		ADD_ATTR: ['target', 'style'],
		FORCE_BODY: true,
	});

	// Wrap in base template
	const unsubscribeUrl = recipientEmail ? generateUnsubscribeUrl(recipientEmail, locale) : undefined;
	const htmlContent = wrapInBaseTemplate({ body: bodyHtml, preheader, locale, unsubscribeUrl });

	// Generate plain text
	const textContent = markdownToPlainText(body);

	return { subject, htmlContent, textContent };
}
