import { NextRequest, NextResponse } from 'next/server';
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';

function getDiscordWebhookUrl(): string | undefined {
	return process.env.PICTURE_CONTEST_DISCORD_WEBHOOK_URL;
}

export async function POST(request: NextRequest) {
	let body: { unique_id?: string; picture_id?: number };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
	}

	const { unique_id, picture_id } = body;

	if (!unique_id || !picture_id) {
		return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
	}

	const supabase = createPictureContestServiceClient();

	// 1. Validate session exists
	const { data: session } = await supabase
		.from('contest_sessions')
		.select('unique_id')
		.eq('unique_id', unique_id)
		.single();

	if (!session) {
		return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
	}

	// 2. Validate picture belongs to this session
	const { data: picture } = await supabase
		.from('contest_pictures')
		.select('id, unique_id, filename, storage_path, is_favorite_1')
		.eq('id', picture_id)
		.eq('unique_id', unique_id)
		.single();

	if (!picture) {
		return NextResponse.json({ error: 'picture_not_in_session' }, { status: 404 });
	}

	// 3. Check if this picture is already a favorite
	if (picture.is_favorite_1) {
		return NextResponse.json({ error: 'already_favorite' }, { status: 409 });
	}

	// 4. Count existing favorites
	const { data: favorites } = await supabase
		.from('contest_favorites')
		.select('favorite_slot')
		.eq('unique_id', unique_id);

	const existingCount = favorites?.length ?? 0;
	if (existingCount >= 2) {
		return NextResponse.json({ error: 'already_two_favorites' }, { status: 409 });
	}

	// 5. Determine favorite slot
	const usedSlots = new Set(favorites?.map((f) => f.favorite_slot) ?? []);
	const favorite_slot = !usedSlots.has(1) ? 1 : 2;

	// 6. Insert into contest_favorites
	const { error: insertError } = await supabase
		.from('contest_favorites')
		.insert({
			unique_id,
			picture_id,
			favorite_slot,
			chosen_at: new Date().toISOString(),
		});

	if (insertError) {
		// Handle race condition: PK constraint (unique_id, favorite_slot) catches duplicates
		if (insertError.code === '23505') {
			return NextResponse.json({ error: 'already_two_favorites' }, { status: 409 });
		}
		console.error('Failed to insert favorite:', insertError);
		return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
	}

	// 7. Update contest_pictures flag
	const updateField = 'is_favorite_1';
	await supabase
		.from('contest_pictures')
		.update({ [updateField]: true })
		.eq('id', picture_id);

	// 8. Post to Discord (non-blocking — don't fail the request if Discord fails)
	let discord_message_id: string | null = null;
	const webhookUrl = getDiscordWebhookUrl();

	if (webhookUrl) {
		try {
			// Generate signed URL for the image
			const { data: signedUrlData } = await supabase.storage
				.from('contest-pictures')
				.createSignedUrl(picture.storage_path, 3600);

			if (signedUrlData?.signedUrl) {
				// Fetch image bytes
				const imageResponse = await fetch(signedUrlData.signedUrl);
				const imageBytes = await imageResponse.arrayBuffer();

				// Post to Discord with image as attachment
				const formData = new FormData();
				formData.append(
					'payload_json',
					JSON.stringify({
						content: `📸 **${unique_id}** chose this photo for the contest!\nVote with ⭐ if you like it!`,
					})
				);
				formData.append(
					'files[0]',
					new Blob([imageBytes], { type: 'image/png' }),
					picture.filename
				);

				const discordResponse = await fetch(webhookUrl, {
					method: 'POST',
					body: formData,
				});

				if (discordResponse.ok) {
					const discordData = await discordResponse.json();
					discord_message_id = discordData.id;

					// Update discord_message_id in contest_favorites
					await supabase
						.from('contest_favorites')
						.update({ discord_message_id })
						.eq('unique_id', unique_id)
						.eq('favorite_slot', favorite_slot);

					// Update discord_posted_at in contest_pictures
					await supabase
						.from('contest_pictures')
						.update({ discord_posted_at: new Date().toISOString() })
						.eq('id', picture_id);
				} else {
					console.error('Discord webhook failed:', discordResponse.status, await discordResponse.text());
				}
			}
		} catch (err) {
			console.error('Discord post failed (non-blocking):', err);
		}
	}

	return NextResponse.json({
		success: true,
		favorite_slot,
		discord_message_id,
	});
}
