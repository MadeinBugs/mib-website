'use client';

import { xp, raisedStyle, sunkenStyle } from './xpStyles';
import type { Tool, SaveStatus } from './types';

interface XPToolbarProps {
	activeTool: Tool;
	onToolChange: (tool: Tool) => void;
	brushSize: number;
	onBrushSizeChange: (size: number) => void;
	onRandomize: () => void;
	saveStatus: SaveStatus;
	saveLabel: string;
}

interface ToolButton {
	tool: Tool;
	icon: string;
	label: string;
	disabled?: boolean;
}

export default function XPToolbar({
	activeTool,
	onToolChange,
	brushSize,
	onBrushSizeChange,
	onRandomize,
	saveStatus,
	saveLabel,
}: XPToolbarProps) {
	const tools: ToolButton[] = [
		{ tool: 'brush', icon: '✏️', label: 'Brush', disabled: true },
		{ tool: 'eraser', icon: '🧽', label: 'Eraser', disabled: true },
		{ tool: 'picker', icon: '💉', label: 'Color Picker', disabled: true },
		{ tool: 'stamp', icon: '⬟', label: 'Stamp', disabled: true },
		{ tool: 'text', icon: 'A', label: 'Text', disabled: true },
	];

	const statusColor =
		saveStatus === 'saved'
			? '#2e7d32'
			: saveStatus === 'saving'
				? '#e65100'
				: saveStatus === 'error'
					? '#c62828'
					: '#666';

	return (
		<div
			style={{
				background: xp.bg,
				width: '72px',
				minWidth: '72px',
				display: 'flex',
				flexDirection: 'column',
				gap: '4px',
				padding: '4px',
				borderRight: `1px solid ${xp.border}`,
				fontFamily: xp.font,
				fontSize: '10px',
				userSelect: 'none',
			}}
		>
			{/* Tools label */}
			<div
				style={{
					textAlign: 'center',
					fontSize: '10px',
					color: '#444',
					fontWeight: 'bold',
					marginBottom: '2px',
				}}
			>
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
				{tools.map(({ tool, icon, label, disabled }) => (
					<button
						key={tool}
						title={label}
						disabled={disabled}
						onClick={() => !disabled && onToolChange(tool)}
						style={{
							width: '28px',
							height: '28px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: disabled ? 'default' : 'pointer',
							border: 'none',
							fontSize: tool === 'text' ? '14px' : '16px',
							fontWeight: tool === 'text' ? 'bold' : 'normal',
							fontFamily: tool === 'text' ? 'serif' : 'inherit',
							background:
								activeTool === tool && !disabled
									? xp.activeToolBg
									: 'transparent',
							opacity: disabled ? 0.4 : 1,
							...(activeTool === tool && !disabled
								? sunkenStyle()
								: raisedStyle()),
						}}
					>
						{icon}
					</button>
				))}
			</div>

			{/* Randomize button */}
			<button
				title="Randomize Colors"
				onClick={onRandomize}
				style={{
					width: '100%',
					height: '28px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '4px',
					cursor: 'pointer',
					border: 'none',
					fontSize: '12px',
					background: xp.bg,
					...raisedStyle(),
				}}
			>
				🎲
			</button>

			{/* Spacer */}
			<div style={{ flex: 1 }} />

			{/* Save status */}
			<div
				style={{
					textAlign: 'center',
					fontSize: '9px',
					color: statusColor,
					padding: '4px 2px',
					wordBreak: 'break-word',
				}}
			>
				{saveLabel}
			</div>
		</div>
	);
}
