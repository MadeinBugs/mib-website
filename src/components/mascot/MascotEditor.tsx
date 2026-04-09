'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMascotLocale } from './MascotLocaleContext';
import type {
	RegionsData,
	BodyRegion,
	EyesRegion,
	CustomizationData,
	Tool,
	SaveStatus,
} from './editor/types';
import {
	DEFAULT_REGIONS,
	DEFAULT_LAYERS,
	APPROVED_COLORS,
} from './editor/types';
import { xp, sunkenStyle } from './editor/xpStyles';
import XPTitleBar from './editor/XPTitleBar';
import XPMenuBar from './editor/XPMenuBar';
import XPToolbar from './editor/XPToolbar';
import XPColorPalette from './editor/XPColorPalette';
import RegionControls from './editor/RegionControls';
import XPStatusBar from './editor/XPStatusBar';
import MascotCanvas from './editor/MascotCanvas';

type RegionKey = 'body' | 'back' | 'eyes';

interface MascotEditorProps {
	userId: string;
	year: number;
	initialData: CustomizationData | null;
	displayName: string | null;
}

const LOCAL_STORAGE_KEY = (userId: string, year: number) =>
	`mascot_${userId}_${year}`;

function buildInitialData(raw: CustomizationData | null): CustomizationData {
	if (raw && raw.regions) return raw;
	return { regions: { ...DEFAULT_REGIONS }, layers: [...DEFAULT_LAYERS] };
}

export default function MascotEditor({
	userId,
	year,
	initialData,
	displayName,
}: MascotEditorProps) {
	const [data, setData] = useState<CustomizationData>(() =>
		buildInitialData(initialData)
	);
	const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
	const [activeTool, setActiveTool] = useState<Tool>('brush');
	const [brushSize, setBrushSize] = useState(8);
	const [activeRegion, setActiveRegion] = useState<RegionKey>('body');
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
	const { t } = useMascotLocale();

	// Track whether any change has happened since mount (skip initial save)
	const hasChangedRef = useRef(false);

	// Load: Supabase is source of truth, localStorage is fallback
	useEffect(() => {
		if (initialData && initialData.regions) {
			setData(initialData);
			try {
				localStorage.setItem(
					LOCAL_STORAGE_KEY(userId, year),
					JSON.stringify(initialData)
				);
			} catch { /* localStorage unavailable */ }
		} else {
			try {
				const cached = localStorage.getItem(LOCAL_STORAGE_KEY(userId, year));
				if (cached) {
					const parsed = JSON.parse(cached) as CustomizationData;
					if (parsed.regions) setData(parsed);
				}
			} catch { /* localStorage unavailable */ }
		}
	}, [initialData, userId, year]);

	// Debounced save to Supabase
	const saveToSupabase = useCallback(
		async (newData: CustomizationData) => {
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
				try {
					localStorage.setItem(
						LOCAL_STORAGE_KEY(userId, year),
						JSON.stringify(newData)
					);
				} catch { /* localStorage unavailable */ }
				return;
			}

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
		if (!hasChangedRef.current) return;

		const timeout = setTimeout(() => {
			saveToSupabase(data);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [data, saveToSupabase]);

	// Region update handler
	const handleRegionUpdate = useCallback(
		(region: RegionKey, updates: Partial<BodyRegion> | Partial<EyesRegion>) => {
			hasChangedRef.current = true;
			setData((prev) => ({
				...prev,
				regions: {
					...prev.regions,
					[region]: { ...prev.regions[region], ...updates },
				},
			}));
			setSaveStatus('idle');
		},
		[]
	);

	// Palette swatch click → update active region color
	const handlePaletteColor = useCallback(
		(color: string) => {
			handleRegionUpdate(activeRegion, { color });
		},
		[activeRegion, handleRegionUpdate]
	);

	// Randomize
	const handleRandomize = useCallback(() => {
		hasChangedRef.current = true;
		const pick = () =>
			APPROVED_COLORS[Math.floor(Math.random() * APPROVED_COLORS.length)];
		const randomPattern = (): BodyRegion['pattern'] => {
			if (Math.random() < 0.5) {
				return { type: 'none', color: '#000000', opacity: 1.0, rotation: 0 };
			}
			const types = ['squiggly', 'stripes', 'dots', 'stars'] as const;
			return {
				type: types[Math.floor(Math.random() * types.length)],
				color: pick(),
				opacity: 0.8 + Math.random() * 0.2,
				rotation: Math.floor(Math.random() * 360),
			};
		};

		setData((prev) => ({
			...prev,
			regions: {
				body: {
					color: pick(),
					opacity: 1.0,
					pattern: randomPattern(),
				},
				back: {
					color: pick(),
					opacity: 1.0,
					pattern: randomPattern(),
				},
				eyes: {
					color: pick(),
					opacity: 1.0,
				},
			},
		}));
		setSaveStatus('idle');
	}, []);

	const handleCursorMove = useCallback((x: number, y: number) => {
		setCursorPos({ x, y });
	}, []);

	// Save status label
	const saveLabel =
		saveStatus === 'saved'
			? t.saved
			: saveStatus === 'saving'
				? t.saving
				: saveStatus === 'error'
					? t.saveError
					: t.ready;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				border: `2px solid ${xp.border}`,
				background: xp.bg,
				maxWidth: '900px',
				margin: '0 auto',
				boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
				overflow: 'hidden',
			}}
		>
			<XPTitleBar title={`Sisifo.bmp - Paint`} />
			<XPMenuBar />

			{/* Editor body: toolbar + canvas */}
			<div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
				<XPToolbar
					activeTool={activeTool}
					onToolChange={setActiveTool}
					brushSize={brushSize}
					onBrushSizeChange={setBrushSize}
					onRandomize={handleRandomize}
					saveStatus={saveStatus}
					saveLabel={saveLabel}
				/>

				{/* Canvas area with sunken border */}
				<div
					style={{
						flex: 1,
						padding: '4px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div
						style={{
							flex: 1,
							...sunkenStyle(),
							padding: '2px',
							background: '#C0C0C0',
							display: 'flex',
							minHeight: '400px',
							maxHeight: '620px',
						}}
					>
						<MascotCanvas
							regions={data.regions}
							onCursorMove={handleCursorMove}
						/>
					</div>
				</div>
			</div>

			{/* Bottom bar: palette + region controls */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '16px',
					padding: '4px 8px',
					borderTop: `1px solid ${xp.border}`,
					background: xp.bg,
					flexWrap: 'wrap',
				}}
			>
				<XPColorPalette
					selectedColor={data.regions[activeRegion].color}
					onColorSelect={handlePaletteColor}
				/>
				<div
					style={{
						width: '1px',
						height: '28px',
						background: xp.border,
					}}
				/>
				<RegionControls
					regions={data.regions}
					activeRegion={activeRegion}
					onActiveRegionChange={setActiveRegion}
					onRegionUpdate={handleRegionUpdate}
				/>
			</div>

			<XPStatusBar
				cursorX={cursorPos.x}
				cursorY={cursorPos.y}
				activeLayer={4}
				activeTool={activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
			/>
		</div>
	);
}
