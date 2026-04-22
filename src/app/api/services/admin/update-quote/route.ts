import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-auth';
import { createServiceClient } from '@/lib/supabase/service';

const Schema = z.object({
	quoteId: z.string().uuid(),
	status: z.enum(['new', 'contacted', 'quoted', 'accepted', 'rejected', 'expired']).optional(),
	notes: z.string().max(10_000).optional(),
});

export async function PATCH(request: NextRequest) {
	const adminCheck = await verifyAdmin();
	if (!adminCheck.ok) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parsed = Schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
	}

	const { quoteId, status, notes } = parsed.data;
	const updates: Record<string, unknown> = {};
	if (status !== undefined) updates.status = status;
	if (notes !== undefined) updates.response_notes = notes;

	if (Object.keys(updates).length === 0) {
		return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
	}

	const supabase = createServiceClient();
	const { error } = await supabase
		.from('quote_requests')
		.update(updates)
		.eq('id', quoteId);

	if (error) {
		console.error('[admin/update-quote] Supabase error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
