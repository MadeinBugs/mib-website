'use client';

import { xp, raisedStyle, sunkenStyle } from './xpStyles';
import type { Tool, SaveStatus, LayerData } from './types';

interface XPToolbarProps {
	activeTool: Tool;
	onToolChange: (tool: Tool) => void;
	brushSize: number;
	onBrushSizeChange: (size: number) => void;
	brushOpacity: number;
	onBrushOpacityChange: (opacity: number) => void;
	brushColor: string;
	onBrushColorChange: (color: string) => void;
	onRandomize: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	layers: LayerData[];
	activeLayerId: number;
	onActiveLayerChange: (id: number) => void;
	onToggleLayerVisibility: (id: number) => void;
	onCycleMaskMode: (id: number) => void;
	saveStatus: SaveStatus;
	saveLabel: string;
	onStartOver: () => void;
}

interface ToolButton {
	tool: Tool;
	icon: string;
	label: string;
}

const MASK_LABELS: Record<string, string> = {
	unmasked: 'None',
	'mask-in': 'In',
	'mask-out': 'Out',
};

export default function XPToolbar({
	activeTool,
	onToolChange,
	brushSize,
	onBrushSizeChange,
	brushOpacity,
	onBrushOpacityChange,
	brushColor,
	onBrushColorChange,
	onRandomize,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	layers,
	activeLayerId,
	onActiveLayerChange,
	onToggleLayerVisibility,
	onCycleMaskMode,
	saveStatus,
	saveLabel,
	onStartOver,
}: XPToolbarProps) {
	const tools: ToolButton[] = [
		{ tool: 'brush', icon: '✏️', label: 'Brush' },
		{ tool: 'eraser', icon: '🧽', label: 'Eraser' },
		{ tool: 'picker', icon: '💉', label: 'Color Picker' },
		{ tool: 'stamp', icon: '⬟', label: 'Stamp' },
		{ tool: 'text', icon: 'A', label: 'Text' },
	];

	const statusColor =
		saveStatus === 'saved'
			? '#2e7d32'
			: saveStatus === 'saving'
				? '#e65100'
				: saveStatus === 'error'
					? '#c62828'
					: '#666';

	const activeLayer = layers.find((l) => l.id === activeLayerId);

	return (
		<div
			style={{
				background: xp.bg,
				width: '82px',
				minWidth: '82px',
				display: 'flex',
				flexDirection: 'column',
				gap: '4px',
				padding: '4px',
				borderRight: `1px solid ${xp.border}`,
				fontFamily: xp.font,
				fontSize: '10px',
				userSelect: 'none',
				overflowY: 'auto',
			}}
		>
			{/* Tools label */}
			<div style={{ textAlign: 'center', fontSize: '10px', color: '#444', fontWeight: 'bold', marginBottom: '2px' }}>
				Tools
			</div>

			{/* Tool buttons as 2-column grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '2px',
					...sunkenStyle(),
					padding: '3px',
					background: xp.bgLight,
				}}
			>
				{tools.map(({ tool, icon, label }) => (
					<button
						key={tool}
						title={label}
						onClick={() => onToolChange(tool)}
						style={{
							width: '28px',
							height: '28px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							border: 'none',
							fontSize: tool === 'text' ? '14px' : '16px',
							fontWeight: tool === 'text' ? 'bold' : 'normal',
							fontFamily: tool === 'text' ? 'serif' : 'inherit',
							background: activeTool === tool ? xp.activeToolBg : 'transparent',
							...(activeTool === tool ? sunkenStyle() : raisedStyle()),
						}}
					>
						{icon}
					</button>
				))}
			</div>

			{/* Undo / Redo */}
			<div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
				<button
					title="Undo (Ctrl+Z)"
					onClick={onUndo}
					disabled={!canUndo}
					style={{
						width: '32px', height: '22px', cursor: canUndo ? 'pointer' : 'default',
						border: 'none', fontSize: '14px', background: xp.bg, opacity: canUndo ? 1 : 0.35,
						...raisedStyle(),
					}}
				>↩</button>
				<button
					title="Redo (Ctrl+Y)"
					onClick={onRedo}
					disabled={!canRedo}
					style={{
						width: '32px', height: '22px', cursor: canRedo ? 'pointer' : 'default',
						border: 'none', fontSize: '14px', background: xp.bg, opacity: canRedo ? 1 : 0.35,
						...raisedStyle(),
					}}
				>↪</button>
			</div>

			{/* Randomize button */}
			<button
				title="Randomize Colors"
				onClick={onRandomize}
				style={{
					width: '100%', height: '24px', display: 'flex', alignItems: 'center',
					justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: '12px',
					background: xp.bg, ...raisedStyle(),
				}}
			><span style={{ fontWeight: 'bold', fontSize: '10px', fontFamily: xp.font }}>RNG</span></button>

			{/* Brush color (visible for brush/stamp/text) */}
			{(activeTool === 'brush' || activeTool === 'stamp' || activeTool === 'text') && (
				<div>
					<div style={{ fontSize: '9px', color: '#444', marginBottom: '2px' }}>Color</div>
					<input
						type="color"
						value={brushColor}
						onChange={(e) => onBrushColorChange(e.target.value)}
						style={{ width: '100%', height: '20px', padding: 0, border: '1px solid #808080', cursor: 'pointer' }}
					/>
				</div>
			)}

			{/* Size slider — XP style */}
			<div>
				<div style={{ fontSize: '9px', color: '#444' }}>Size: {brushSize}px</div>
				<div style={{ position: 'relative', height: '20px', ...sunkenStyle(), background: xp.bgLight, padding: '0 2px' }}>
					{/* Track ticks */}
					<div style={{ position: 'absolute', top: '50%', left: '4px', right: '4px', height: '2px', background: '#808080', transform: 'translateY(-50%)' }} />
					<input
						type="range" min={1} max={50} value={brushSize}
						onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
						className="xp-slider"
						style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
					/>
				</div>
			</div>

			{/* Opacity slider — XP style */}
			{activeTool !== 'picker' && (
				<div>
					<div style={{ fontSize: '9px', color: '#444' }}>Opacity: {Math.round(brushOpacity * 100)}%</div>
					<div style={{ position: 'relative', height: '20px', ...sunkenStyle(), background: xp.bgLight, padding: '0 2px' }}>
						<div style={{ position: 'absolute', top: '50%', left: '4px', right: '4px', height: '2px', background: '#808080', transform: 'translateY(-50%)' }} />
						<input
							type="range" min={5} max={100} value={Math.round(brushOpacity * 100)}
							onChange={(e) => onBrushOpacityChange(parseInt(e.target.value) / 100)}
							className="xp-slider"
							style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
						/>
					</div>
				</div>
			)}

			{/* Layers panel */}
			<div style={{ marginTop: '4px' }}>
				<div style={{ fontSize: '9px', color: '#444', fontWeight: 'bold', marginBottom: '2px' }}>Layers</div>
				<div style={{ ...sunkenStyle(), padding: '2px', background: xp.bgLight }}>
					{layers.map((layer) => (
						<div
							key={layer.id}
							onClick={() => onActiveLayerChange(layer.id)}
							style={{
								display: 'flex', alignItems: 'center', gap: '2px',
								padding: '1px 2px', cursor: 'pointer',
								background: layer.id === activeLayerId ? xp.activeToolBg : 'transparent',
								fontSize: '10px',
							}}
						>
							<button
								title={layer.visible ? 'Hide layer' : 'Show layer'}
								onClick={(e) => { e.stopPropagation(); onToggleLayerVisibility(layer.id); }}
								style={{
									width: '16px', height: '16px', border: 'none', cursor: 'pointer',
									background: 'transparent', fontSize: '10px', padding: 0,
								}}
							>{layer.visible ? '👁' : '—'}</button>
							<span>L{layer.id}</span>
						</div>
					))}
				</div>
			</div>

			{/* Mask mode for active layer */}
			{activeLayer && (
				<div>
					<div style={{ fontSize: '9px', color: '#444' }}>Mask:</div>
					<button
						title="Cycle mask mode: None → In → Out"
						onClick={() => onCycleMaskMode(activeLayerId)}
						style={{
							width: '100%', height: '20px', fontSize: '9px',
							cursor: 'pointer', border: 'none', background: xp.bg,
							fontFamily: xp.font, ...raisedStyle(),
						}}
					>{MASK_LABELS[activeLayer.maskMode]}</button>
				</div>
			)}

			{/* Start over */}
			<button
				title="Start over / Recomeçar"
				onClick={onStartOver}
				style={{
					width: '100%', height: '24px', display: 'flex', alignItems: 'center',
					justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: '9px',
					background: xp.bg, fontFamily: xp.font, color: '#c62828', fontWeight: 'bold',
					...raisedStyle(),
				}}
			>Start Over</button>

			{/* Spacer */}
			<div style={{ flex: 1 }} />

			{/* Save status */}
			<div style={{ textAlign: 'center', fontSize: '9px', color: statusColor, padding: '4px 2px', wordBreak: 'break-word' }}>
				{saveLabel}
			</div>
		</div>
	);
}
