// Brevo API wrapper for newsletter management

const BREVO_API_URL = 'https://api.brevo.com/v3';

function getApiKey(): string {
	const key = process.env.BREVO_API_KEY;
	if (!key) throw new Error('BREVO_API_KEY is not set');
	return key;
}

function headers(): HeadersInit {
	return {
		'api-key': getApiKey(),
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};
}

// List IDs from Brevo
export const BREVO_LISTS = {
	ASUMI: parseInt(process.env.BREVO_LIST_ASUMI || '5'),
	STUDIO: parseInt(process.env.BREVO_LIST_STUDIO || '6'),
	DEVLOG: parseInt(process.env.BREVO_LIST_DEVLOG || '7'),
} as const;

export interface BrevoContact {
	email: string;
	id?: number;
	listIds?: number[];
	attributes?: {
		CONFIRMED?: boolean;
		CONFIRMATION_TOKEN?: string;
		CONFIRMATION_CREATED_AT?: string;
		LOCALE?: string;
	};
}

/**
 * Get a contact by email. Returns null if not found.
 */
export async function getContact(email: string): Promise<BrevoContact | null> {
	const res = await fetch(
		`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`,
		{ method: 'GET', headers: headers() }
	);

	if (res.status === 404) return null;

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Brevo getContact failed (${res.status}): ${body}`);
	}

	return res.json();
}

/**
 * Create a new contact in Brevo.
 */
export async function createContact(params: {
	email: string;
	listIds: number[];
	attributes: Record<string, unknown>;
}): Promise<void> {
	const res = await fetch(`${BREVO_API_URL}/contacts`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({
			email: params.email,
			listIds: params.listIds,
			attributes: params.attributes,
			updateEnabled: true,
		}),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Brevo createContact failed (${res.status}): ${body}`);
	}
}

/**
 * Update an existing contact in Brevo.
 */
export async function updateContact(
	email: string,
	params: {
		listIds?: number[];
		unlinkListIds?: number[];
		attributes?: Record<string, unknown>;
	}
): Promise<void> {
	const res = await fetch(
		`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`,
		{
			method: 'PUT',
			headers: headers(),
			body: JSON.stringify(params),
		}
	);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Brevo updateContact failed (${res.status}): ${body}`);
	}
}

/**
 * Send a transactional email via Brevo.
 */
export async function sendTransactionalEmail(params: {
	to: { email: string }[];
	subject: string;
	htmlContent: string;
	textContent?: string;
	sender: { name: string; email: string };
}): Promise<void> {
	const body: Record<string, unknown> = {
		to: params.to,
		subject: params.subject,
		htmlContent: params.htmlContent,
		sender: params.sender,
	};
	if (params.textContent) {
		body.textContent = params.textContent;
	}

	const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Brevo sendEmail failed (${res.status}): ${body}`);
	}
}
