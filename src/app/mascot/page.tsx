import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MascotEditor from '@/components/mascot/MascotEditor';

const CURRENT_YEAR = new Date().getFullYear();

export default async function MascotPage() {
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		redirect('/mascot/login');
	}

	// Load existing customization for this year
	const { data: customization } = await supabase
		.from('mascot_customizations')
		.select('customization_data')
		.eq('user_id', user.id)
		.eq('year', CURRENT_YEAR)
		.single();

	// Load profile for display name
	const { data: profile } = await supabase
		.from('profiles')
		.select('display_name')
		.eq('id', user.id)
		.single();

	return (
		<MascotEditor
			userId={user.id}
			year={CURRENT_YEAR}
			initialData={customization?.customization_data ?? null}
			displayName={profile?.display_name ?? null}
		/>
	);
}
