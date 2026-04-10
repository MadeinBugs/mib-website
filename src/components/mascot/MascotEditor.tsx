'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMascotLocale } from './MascotLocaleContext';
import type {
	CustomizationData,
	BodyRegion,
	EyesRegion,
	StrokeData,
	Tool,
	SaveStatus,
	PatternSettings,
} from './editor/types';
import {
	DEFAULT_REGIONS,
	DEFAULT_LAYERS,
	APPROVED_COLORS,
	CANVAS_SIZE,
	MASCOT_ASSETS,
} from './editor/types';
import XPTitleBar from './editor/XPTitleBar';
import XPMenuBar from './editor/XPMenuBar';
import XPToolbar from './editor/XPToolbar';
import XPColorPalette from './editor/XPColorPalette';
import RegionControls from './editor/RegionControls';
import XPStatusBar from './editor/XPStatusBar';
import MascotCanvas, { type MascotCanvasHandle } from './editor/MascotCanvas';

const MAX_UNDO = 50;

function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

function buildInitialData(raw: CustomizationData | null): CustomizationData {
	if (!raw) {
		return { regions: deepClone(DEFAULT_REGIONS), layers: deepClone(DEFAULT_LAYERS) };
	}
	return {
		regions: { ...deepClone(DEFAULT_REGIONS), ...raw.regions },
		layers: raw.layers?.length ? raw.layers : deepClone(DEFAULT_LAYERS),
	};
}

function randomColor() {
	return APPROVED_COLORS[Math.floor(Math.random() * APPROVED_COLORS.length)];
}

const PATTERN_TYPES: PatternSettings['type'][] = ['none', 'squiggly', 'stripes', 'dots', 'stars'];

function randomPattern(): PatternSettings {
	// 50% chance of having a pattern
	if (Math.random() < 0.5) {
		return { type: 'none', color: '#000000', opacity: 1.0, rotation: 0 };
	}
	const types = PATTERN_TYPES.filter((t) => t !== 'none');
	return {
		type: types[Math.floor(Math.random() * types.length)],
		color: randomColor(),
		opacity: 0.8 + Math.random() * 0.2, // 80-100%
		rotation: Math.floor(Math.random() * 360),
	};
}

interface MascotEditorProps {
	userId: string;
	year: number;
	initialData: CustomizationData | null;
	displayName: string | null;
}

export default function MascotEditor({ userId, year, initialData, displayName }: MascotEditorProps) {
	const { t } = useMascotLocale();
	const supabase = useMemo(() => createClient(), []);
	const canvasRef = useRef<MascotCanvasHandle>(null);

	// --- Core data (ref is the source of truth; render via tick) ---
	const dataRef = useRef<CustomizationData>(buildInitialData(initialData));
	const pastRef = useRef<CustomizationData[]>([]);
	const futureRef = useRef<CustomizationData[]>([]);
	const [renderTick, setRenderTick] = useState(0);

	// Read from ref for rendering
	const data = dataRef.current;
	const canUndo = pastRef.current.length > 0;
	const canRedo = futureRef.current.length > 0;

	// Apply a new data snapshot, pushing current state to undo
	const commitChange = useCallback((newData: CustomizationData) => {
		const trimmed = pastRef.current.length >= MAX_UNDO
			? pastRef.current.slice(1)
			: pastRef.current;
		pastRef.current = [...trimmed, deepClone(dataRef.current)];
		futureRef.current = [];
		dataRef.current = newData;
		setRenderTick((v) => v + 1);
	}, []);

	const handleUndo = useCallback(() => {
		if (pastRef.current.length === 0) return;
		const snapshot = pastRef.current.pop()!;
		futureRef.current.push(deepClone(dataRef.current));
		dataRef.current = deepClone(snapshot);
		setRenderTick((v) => v + 1);
	}, []);

	const handleRedo = useCallback(() => {
		if (futureRef.current.length === 0) return;
		const snapshot = futureRef.current.pop()!;
		pastRef.current.push(deepClone(dataRef.current));
		dataRef.current = deepClone(snapshot);
		setRenderTick((v) => v + 1);
	}, []);

	// --- Tool & brush state ---
	const [activeTool, setActiveTool] = useState<Tool>('brush');
	const [brushSize, setBrushSize] = useState(8);
	const [brushColor, setBrushColor] = useState('#000000');
	const [brushOpacity, setBrushOpacity] = useState(1.0);
	const [activeLayerId, setActiveLayerId] = useState(4);
	const [activeRegion, setActiveRegion] = useState<'body' | 'back' | 'eyes'>('body');

	// --- Save state ---
	const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
	const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastSavedRef = useRef<string>(JSON.stringify(buildInitialData(initialData)));

	// --- Cursor ---
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

	// --- Silhouette canvas for masking ---
	const [silhouetteCanvas, setSilhouetteCanvas] = useState<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const img = new window.Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			const c = document.createElement('canvas');
			c.width = CANVAS_SIZE;
			c.height = CANVAS_SIZE;
			const ctx = c.getContext('2d');
			if (ctx) {
				ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
			}
			setSilhouetteCanvas(c);
		};
		img.src = MASCOT_ASSETS.silhouette;
	}, []);

	// --- Keyboard shortcuts ---
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
				e.preventDefault();
				handleUndo();
			}
			if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
				e.preventDefault();
				handleRedo();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleUndo, handleRedo]);

	// --- Auto-save with debounce ---
	const scheduleSave = useCallback(
		(newData: CustomizationData) => {
			const serialized = JSON.stringify(newData);
			// Mirror to localStorage
			try {
				localStorage.setItem(`mascot_${userId}_${year}`, serialized);
			} catch { /* quota exceeded, ignore */ }

			if (serialized === lastSavedRef.current) return;
			setSaveStatus('saving');

			if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
			saveTimerRef.current = setTimeout(async () => {
				try {
					const { error } = await supabase
						.from('mascot_customizations')
						.upsert(
							{ user_id: userId, year, customization_data: newData, updated_at: new Date().toISOString() },
							{ onConflict: 'user_id,year' }
						);
					if (error) throw error;
					lastSavedRef.current = serialized;
					setSaveStatus('saved');
				} catch {
					setSaveStatus('error');
				}
			}, 2000);
		},
		[supabase, userId, year]
	);

	// Trigger save whenever data changes
	useEffect(() => {
		scheduleSave(dataRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderTick, scheduleSave]);

	// --- Callbacks ---

	const handleStrokeComplete = useCallback(
		(layerId: number, stroke: StrokeData) => {
			const prev = dataRef.current;
			const newLayers = prev.layers.map((l) =>
				l.id === layerId ? { ...l, strokes: [...l.strokes, stroke] } : l
			);
			commitChange({ ...prev, layers: newLayers });
		},
		[commitChange]
	);

	const handleRegionUpdate = useCallback(
		(region: 'body' | 'back' | 'eyes', updates: Partial<BodyRegion> | Partial<EyesRegion>) => {
			const prev = dataRef.current;
			commitChange({
				...prev,
				regions: {
					...prev.regions,
					[region]: { ...prev.regions[region], ...updates },
				},
			});
		},
		[commitChange]
	);

	const handleRandomize = useCallback(() => {
		const prev = dataRef.current;
		commitChange({
			...prev,
			regions: {
				body: { ...prev.regions.body, color: randomColor(), pattern: randomPattern() },
				back: { ...prev.regions.back, color: randomColor(), pattern: randomPattern() },
				eyes: { ...prev.regions.eyes, color: randomColor() },
			},
		});
	}, [commitChange]);

	const handleToggleLayerVisibility = useCallback(
		(id: number) => {
			const prev = dataRef.current;
			commitChange({
				...prev,
				layers: prev.layers.map((l) =>
					l.id === id ? { ...l, visible: !l.visible } : l
				),
			});
		},
		[commitChange]
	);

	const handleCycleMaskMode = useCallback(
		(id: number) => {
			const prev = dataRef.current;
			const cycle: Record<string, 'unmasked' | 'mask-in' | 'mask-out'> = {
				unmasked: 'mask-in',
				'mask-in': 'mask-out',
				'mask-out': 'unmasked',
			};
			commitChange({
				...prev,
				layers: prev.layers.map((l) =>
					l.id === id ? { ...l, maskMode: cycle[l.maskMode] } : l
				),
			});
		},
		[commitChange]
	);

	const handlePickColor = useCallback((color: string) => {
		setBrushColor(color);
		setActiveTool('brush');
	}, []);

	// Color palette selects the active region color (not the brush color)
	const handlePaletteColorSelect = useCallback(
		(color: string) => {
			handleRegionUpdate(activeRegion, { color });
		},
		[handleRegionUpdate, activeRegion]
	);

	const handleStartOver = useCallback(() => {
		if (!window.confirm('Start over? This will erase all your customizations.\n\nRecomeçar? Isso apagará todas as suas customizações.')) {
			return;
		}
		commitChange(buildInitialData(null));
	}, [commitChange]);

	// --- Save label ---
	const saveLabel =
		saveStatus === 'saved'
			? t.saved
			: saveStatus === 'saving'
				? t.saving
				: saveStatus === 'error'
					? t.saveError
					: t.ready;

	return (
		<div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					maxWidth: '960px',
					maxHeight: 'calc(100vh - 120px)',
					overflow: 'hidden',
					boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
				}}
			>
				<XPTitleBar title={t.editorTitle} />
				<XPMenuBar />

				<div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
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
						onStartOver={handleStartOver}
					/>

					<div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
						{/* Canvas */}
						<MascotCanvas
							ref={canvasRef}
							regions={data.regions}
							layers={data.layers}
							activeLayerId={activeLayerId}
							activeTool={activeTool}
							brushSize={brushSize}
							brushColor={brushColor}
							brushOpacity={brushOpacity}
							silhouetteCanvas={silhouetteCanvas}
							onCursorMove={(x, y) => setCursorPos({ x, y })}
							onStrokeComplete={handleStrokeComplete}
							onPickColor={handlePickColor}
						/>

						{/* Region controls below canvas, above palette */}
						<RegionControls
							regions={data.regions}
							activeRegion={activeRegion}
							onActiveRegionChange={setActiveRegion}
							onRegionUpdate={handleRegionUpdate}
						/>

						{/* Color palette selects the active region's color */}
						<XPColorPalette
							selectedColor={data.regions[activeRegion].color}
							onColorSelect={handlePaletteColorSelect}
						/>
					</div>
				</div>

				<XPStatusBar
					cursorX={cursorPos.x}
					cursorY={cursorPos.y}
					activeLayer={activeLayerId}
					activeTool={activeTool}
				/>
			</div>
		</div>
	);
}
