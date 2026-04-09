'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMascotLocale } from './MascotLocaleContext';
import type {
	RegionsData,
	BodyRegion,
	EyesRegion,
	CustomizationData,
	LayerData,
	StrokeData,
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

function deepCloneLayers(layers: LayerData[]): LayerData[] {
	return layers.map((l) => ({
		...l,
		strokes: l.strokes.map((s) => ({ ...s, points: s.points ? [...s.points] : undefined })),
	}));
}

function buildInitialData(raw: CustomizationData | null): CustomizationData {
	if (raw && raw.regions) {
		return {
			regions: raw.regions,
			layers: raw.layers && raw.layers.length > 0 ? raw.layers : deepCloneLayers(DEFAULT_LAYERS),
		};
	}
	return { regions: { ...DEFAULT_REGIONS }, layers: deepCloneLayers(DEFAULT_LAYERS) };
}

// Per-layer undo/redo history
interface LayerHistory {
	past: StrokeData[][];
	future: StrokeData[][];
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
	const [brushColor, setBrushColor] = useState('#000000');
	const [brushOpacity, setBrushOpacity] = useState(1.0);
	const [activeRegion, setActiveRegion] = useState<RegionKey>('body');
	const [activeLayerId, setActiveLayerId] = useState(4);
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
	const { t } = useMascotLocale();

	const hasChangedRef = useRef(false);

	// Per-layer undo/redo history — keyed by layer id
	const [histories, setHistories] = useState<Record<number, LayerHistory>>(() => {
		const h: Record<number, LayerHistory> = {};
		for (const layer of (initialData?.layers ?? DEFAULT_LAYERS)) {
			h[layer.id] = { past: [], future: [] };
		}
		return h;
	});

	// Load
	useEffect(() => {
		if (initialData && initialData.regions) {
			setData(buildInitialData(initialData));
			try {
				localStorage.setItem(LOCAL_STORAGE_KEY(userId, year), JSON.stringify(initialData));
			} catch { /* localStorage unavailable */ }
		} else {
			try {
				const cached = localStorage.getItem(LOCAL_STORAGE_KEY(userId, year));
				if (cached) {
					const parsed = JSON.parse(cached) as CustomizationData;
					if (parsed.regions) setData(buildInitialData(parsed));
				}
			} catch { /* localStorage unavailable */ }
		}
	}, [initialData, userId, year]);

	// Save
	const saveToSupabase = useCallback(
		async (newData: CustomizationData) => {
			setSaveStatus('saving');
			const supabase = createClient();
			const { error } = await supabase
				.from('mascot_customizations')
				.upsert(
					{ user_id: userId, year, customization_data: newData, updated_at: new Date().toISOString() },
					{ onConflict: 'user_id,year' }
				);
			if (error) {
				setSaveStatus('error');
				try { localStorage.setItem(LOCAL_STORAGE_KEY(userId, year), JSON.stringify(newData)); } catch { }
				return;
			}
			try { localStorage.setItem(LOCAL_STORAGE_KEY(userId, year), JSON.stringify(newData)); } catch { }
			setSaveStatus('saved');
		},
		[userId, year]
	);

	useEffect(() => {
		if (!hasChangedRef.current) return;
		const timeout = setTimeout(() => { saveToSupabase(data); }, 2000);
		return () => clearTimeout(timeout);
	}, [data, saveToSupabase]);

	// Region update handler
	const handleRegionUpdate = useCallback(
		(region: RegionKey, updates: Partial<BodyRegion> | Partial<EyesRegion>) => {
			hasChangedRef.current = true;
			setData((prev) => ({
				...prev,
				regions: { ...prev.regions, [region]: { ...prev.regions[region], ...updates } },
			}));
			setSaveStatus('idle');
		},
		[]
	);

	const handlePaletteColor = useCallback(
		(color: string) => {
			handleRegionUpdate(activeRegion, { color });
		},
		[activeRegion, handleRegionUpdate]
	);

	// Randomize
	const handleRandomize = useCallback(() => {
		hasChangedRef.current = true;
		const pick = () => APPROVED_COLORS[Math.floor(Math.random() * APPROVED_COLORS.length)];
		const randomPattern = (): BodyRegion['pattern'] => {
			if (Math.random() < 0.5) return { type: 'none', color: '#000000', opacity: 1.0, rotation: 0 };
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
				body: { color: pick(), opacity: 1.0, pattern: randomPattern() },
				back: { color: pick(), opacity: 1.0, pattern: randomPattern() },
				eyes: { color: pick(), opacity: 1.0 },
			},
		}));
		setSaveStatus('idle');
	}, []);

	const handleCursorMove = useCallback((x: number, y: number) => {
		setCursorPos({ x, y });
	}, []);

	// Stroke completion — push to layer + undo history
	const handleStrokeComplete = useCallback((layerId: number, stroke: StrokeData) => {
		hasChangedRef.current = true;
		setData((prev) => ({
			...prev,
			layers: prev.layers.map((l) =>
				l.id === layerId ? { ...l, strokes: [...l.strokes, stroke] } : l
			),
		}));
		setHistories((prev) => ({
			...prev,
			[layerId]: {
				past: [...(prev[layerId]?.past ?? []), data.layers.find((l) => l.id === layerId)?.strokes ?? []],
				future: [],
			},
		}));
		setSaveStatus('idle');
	}, [data.layers]);

	// Undo
	const handleUndo = useCallback(() => {
		const history = histories[activeLayerId];
		if (!history || history.past.length === 0) return;
		hasChangedRef.current = true;
		const currentStrokes = data.layers.find((l) => l.id === activeLayerId)?.strokes ?? [];
		const previousStrokes = history.past[history.past.length - 1];
		setHistories((prev) => ({
			...prev,
			[activeLayerId]: {
				past: prev[activeLayerId].past.slice(0, -1),
				future: [currentStrokes, ...prev[activeLayerId].future],
			},
		}));
		setData((prev) => ({
			...prev,
			layers: prev.layers.map((l) =>
				l.id === activeLayerId ? { ...l, strokes: previousStrokes } : l
			),
		}));
		setSaveStatus('idle');
	}, [activeLayerId, histories, data.layers]);

	// Redo
	const handleRedo = useCallback(() => {
		const history = histories[activeLayerId];
		if (!history || history.future.length === 0) return;
		hasChangedRef.current = true;
		const currentStrokes = data.layers.find((l) => l.id === activeLayerId)?.strokes ?? [];
		const nextStrokes = history.future[0];
		setHistories((prev) => ({
			...prev,
			[activeLayerId]: {
				past: [...prev[activeLayerId].past, currentStrokes],
				future: prev[activeLayerId].future.slice(1),
			},
		}));
		setData((prev) => ({
			...prev,
			layers: prev.layers.map((l) =>
				l.id === activeLayerId ? { ...l, strokes: nextStrokes } : l
			),
		}));
		setSaveStatus('idle');
	}, [activeLayerId, histories, data.layers]);

	const canUndo = (histories[activeLayerId]?.past.length ?? 0) > 0;
	const canRedo = (histories[activeLayerId]?.future.length ?? 0) > 0;

	// Layer visibility toggle
	const handleToggleLayerVisibility = useCallback((id: number) => {
		hasChangedRef.current = true;
		setData((prev) => ({
			...prev,
			layers: prev.layers.map((l) =>
				l.id === id ? { ...l, visible: !l.visible } : l
			),
		}));
		setSaveStatus('idle');
	}, []);

	// Cycle mask mode
	const handleCycleMaskMode = useCallback((id: number) => {
		hasChangedRef.current = true;
		const modes: LayerData['maskMode'][] = ['unmasked', 'mask-in', 'mask-out'];
		setData((prev) => ({
			...prev,
			layers: prev.layers.map((l) => {
				if (l.id !== id) return l;
				const nextIdx = (modes.indexOf(l.maskMode) + 1) % modes.length;
				return { ...l, maskMode: modes[nextIdx] };
			}),
		}));
		setSaveStatus('idle');
	}, []);

	// Color picker callback
	const handlePickColor = useCallback((color: string) => {
		setBrushColor(color);
		setActiveTool('brush');
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
				e.preventDefault();
				handleUndo();
			} else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
				e.preventDefault();
				handleRedo();
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [handleUndo, handleRedo]);

	const saveLabel =
		saveStatus === 'saved' ? t.saved
			: saveStatus === 'saving' ? t.saving
				: saveStatus === 'error' ? t.saveError
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
			<XPTitleBar title="Sisifo.bmp - Paint" />
			<XPMenuBar />

			<div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
				<XPToolbar
					activeTool={activeTool}
					onToolChange={setActiveTool}
					brushSize={brushSize}
					onBrushSizeChange={setBrushSize}
					brushOpacity={brushOpacity}
					onBrushOpacityChange={setBrushOpacity}
					brushColor={brushColor}
					onBrushColorChange={setBrushColor}
					onRandomize={handleRandomize}
					onUndo={handleUndo}
					onRedo={handleRedo}
					canUndo={canUndo}
					canRedo={canRedo}
					layers={data.layers}
					activeLayerId={activeLayerId}
					onActiveLayerChange={setActiveLayerId}
					onToggleLayerVisibility={handleToggleLayerVisibility}
					onCycleMaskMode={handleCycleMaskMode}
					saveStatus={saveStatus}
					saveLabel={saveLabel}
				/>

				<div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							flex: 1, ...sunkenStyle(), padding: '2px', background: '#C0C0C0',
							display: 'flex', minHeight: '400px', maxHeight: '620px',
						}}
					>
						<MascotCanvas
							regions={data.regions}
							layers={data.layers}
							activeLayerId={activeLayerId}
							activeTool={activeTool}
							brushSize={brushSize}
							brushColor={brushColor}
							brushOpacity={brushOpacity}
							onCursorMove={handleCursorMove}
							onStrokeComplete={handleStrokeComplete}
							onPickColor={handlePickColor}
						/>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div
				style={{
					display: 'flex', alignItems: 'center', gap: '16px',
					padding: '4px 8px', borderTop: `1px solid ${xp.border}`,
					background: xp.bg, flexWrap: 'wrap',
				}}
			>
				<XPColorPalette
					selectedColor={data.regions[activeRegion].color}
					onColorSelect={handlePaletteColor}
				/>
				<div style={{ width: '1px', height: '28px', background: xp.border }} />
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
				activeLayer={activeLayerId}
				activeTool={activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
			/>
		</div>
	);
}
