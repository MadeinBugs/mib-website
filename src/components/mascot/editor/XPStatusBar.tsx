'use client';

import { xp, sunkenStyle } from './xpStyles';

interface XPStatusBarProps {
	cursorX: number;
	cursorY: number;
	activeLayer: number;
	activeTool: string;
}

export default function XPStatusBar({
	cursorX,
	cursorY,
	activeLayer,
	activeTool,
}: XPStatusBarProps) {
	const cellStyle: React.CSSProperties = {
		padding: '2px 8px',
		...sunkenStyle(),
	};

	return (
		<div
			style={{
				background: xp.statusBg,
				fontFamily: xp.font,
				fontSize: '11px',
				display: 'flex',
				gap: '2px',
				padding: '2px 4px',
				borderTop: `1px solid ${xp.border}`,
				userSelect: 'none',
			}}
		>
			<span style={{ ...cellStyle, minWidth: '120px' }}>
				Position: {cursorX}, {cursorY}
			</span>
			<span style={{ ...cellStyle, minWidth: '80px' }}>
				Layer: {activeLayer}
			</span>
			<span style={{ ...cellStyle, flex: 1 }}>
				Tool: {activeTool}
			</span>
		</div>
	);
}
