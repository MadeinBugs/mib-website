import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ArtistGallery from '@/components/mascot/ArtistGallery';

const CURRENT_YEAR = new Date().getFullYear();

export default async function GalleryPage() {
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect('/mascot/login');
	}

	// Check role
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user.id)
		.single();

	if (profile?.role !== 'admin') {
		redirect('/mascot');
	}

	// Fetch all customizations for the current year, joined with profiles
	const { data: customizations } = await supabase
		.from('mascot_customizations')
		.select('user_id, year, updated_at, customization_data, profiles(display_name)')
		.eq('year', CURRENT_YEAR)
		.order('updated_at', { ascending: false });

	// Generate signed URLs for each preview PNG
	const items = await Promise.all(
		(customizations ?? []).map(async (item) => {
			const { data: urlData } = await supabase.storage
				.from('mascot-previews')
				.createSignedUrl(`${item.user_id}/${CURRENT_YEAR}.png`, 3600);

			// profiles comes back as an object (single FK join) or null
			const profileData = item.profiles as unknown as { display_name: string } | null;

			return {
				userId: item.user_id as string,
				displayName: profileData?.display_name ?? 'Unknown',
				updatedAt: item.updated_at as string,
				commentary: (item.customization_data as Record<string, unknown>)?.commentary as string | undefined,
				customizationData: item.customization_data as Record<string, unknown>,
				previewUrl: urlData?.signedUrl ?? null,
			};
		})
	);

	return <ArtistGallery items={items} year={CURRENT_YEAR} />;
}
