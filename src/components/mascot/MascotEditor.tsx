'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMascotLocale } from './MascotLocaleContext';

interface MascotCustomizationData {
	// Placeholder structure — will be expanded when designing the editor
	[key: string]: unknown;
}

interface MascotEditorProps {
	userId: string;
	year: number;
	initialData: MascotCustomizationData | null;
	displayName: string | null;
}

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

const LOCAL_STORAGE_KEY = (userId: string, year: number) =>
	`mascot_${userId}_${year}`;

export default function MascotEditor({ userId, year, initialData, displayName }: MascotEditorProps) {
	const [data, setData] = useState<MascotCustomizationData>(initialData ?? {});
	const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
	const { t } = useMascotLocale();

	// Load: Supabase is source of truth, localStorage is fallback
	useEffect(() => {
		if (initialData) {
			setData(initialData);
			// Mirror server data to local cache
			try {
				localStorage.setItem(
					LOCAL_STORAGE_KEY(userId, year),
					JSON.stringify(initialData)
				);
			} catch { /* localStorage unavailable */ }
		} else {
			// No server data — try localStorage fallback
			try {
				const cached = localStorage.getItem(LOCAL_STORAGE_KEY(userId, year));
				if (cached) {
					setData(JSON.parse(cached));
				}
			} catch { /* localStorage unavailable */ }
		}
	}, [initialData, userId, year]);

	// Debounced save to Supabase
	const saveToSupabase = useCallback(
		async (newData: MascotCustomizationData) => {
			setSaveStatus('saving');
			const supabase = createClient();

			const { error } = await supabase
				.from('mascot_customizations')
				.upsert(
					{
						user_id: userId,
						year,
						customization_data: newData,
						updated_at: new Date().toISOString(),
					},
					{ onConflict: 'user_id,year' }
				);

			if (error) {
				setSaveStatus('error');
				// Fallback: save to localStorage only
				try {
					localStorage.setItem(
						LOCAL_STORAGE_KEY(userId, year),
						JSON.stringify(newData)
					);
				} catch { /* localStorage unavailable */ }
				return;
			}

			// On success, mirror to localStorage
			try {
				localStorage.setItem(
					LOCAL_STORAGE_KEY(userId, year),
					JSON.stringify(newData)
				);
			} catch { /* localStorage unavailable */ }

			setSaveStatus('saved');
		},
		[userId, year]
	);

	// Debounce: save 2 seconds after last change
	useEffect(() => {
		// Don't save on initial mount
		if (Object.keys(data).length === 0) return;

		const timeout = setTimeout(() => {
			saveToSupabase(data);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [data, saveToSupabase]);

	// Update handler for child components to call
	const updateData = useCallback((updates: Partial<MascotCustomizationData>) => {
		setData((prev) => ({ ...prev, ...updates }));
		setSaveStatus('idle');
	}, []);

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="text-center mb-8">
				<h2 className="font-h2 text-2xl font-bold text-neutral-800 mb-2">
					{t.editorTitle}
				</h2>
				<p className="text-neutral-600 font-body">
					{displayName ? t.editorWelcome(displayName) : t.editorWelcomeAnon}{' '}
					{t.editorSubtitle(year)}
				</p>
			</div>

			{/* Save status indicator */}
			<div className="flex justify-end">
				<span
					className={`text-sm font-body px-3 py-1 rounded-full ${saveStatus === 'saved'
						? 'bg-green-100 text-green-700'
						: saveStatus === 'saving'
							? 'bg-yellow-100 text-yellow-700'
							: saveStatus === 'error'
								? 'bg-red-100 text-red-700'
								: 'bg-neutral-100 text-neutral-500'
						}`}
				>
					{saveStatus === 'saved' && t.saved}
					{saveStatus === 'saving' && t.saving}
					{saveStatus === 'error' && t.saveError}
					{saveStatus === 'idle' && t.ready}
				</span>
			</div>

			{/* Editor placeholder — will be replaced with actual mascot customization UI */}
			<div className="bg-white rounded-crayon border-2 border-amber-200 p-8 text-center">
				<p className="text-neutral-500 font-body text-lg">
					{t.editorPlaceholder}
				</p>
				<p className="text-neutral-400 font-body text-sm mt-2">
					{t.editorPlaceholderSub}
				</p>

				{/* Temporary: show raw data for debugging */}
				<pre className="mt-4 text-left bg-neutral-50 p-4 rounded-lg text-xs overflow-auto max-h-40">
					{JSON.stringify(data, null, 2)}
				</pre>
			</div>
		</div>
	);
}
