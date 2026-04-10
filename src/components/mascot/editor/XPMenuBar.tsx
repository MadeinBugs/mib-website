'use client';

import { useState, useRef, useEffect } from 'react';
import { xp } from './xpStyles';

interface XPMenuBarProps {
	onExport: (scale: 1 | 2 | 4) => void;
}

export default function XPMenuBar({ onExport }: XPMenuBarProps) {
	const [fileOpen, setFileOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!fileOpen) return;
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setFileOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [fileOpen]);

	const handleExport = (scale: 1 | 2 | 4) => {
		setFileOpen(false);
		onExport(scale);
	};

	return (
		<div
			style={{
				background: xp.menuBg,
				fontFamily: xp.font,
				fontSize: xp.fontSize,
				padding: '1px 2px',
				display: 'flex',
				alignItems: 'center',
				borderBottom: `1px solid ${xp.border}`,
				userSelect: 'none',
				position: 'relative',
				zIndex: 100,
			}}
		>
			{/* File menu with dropdown */}
			<div ref={menuRef} style={{ position: 'relative' }}>
				<button
					onClick={() => setFileOpen((v) => !v)}
					style={{
						background: fileOpen ? xp.activeToolBg : 'transparent',
						border: 'none',
						fontFamily: xp.font,
						fontSize: xp.fontSize,
						padding: '2px 8px',
						cursor: 'default',
						color: '#000',
					}}
				>
					File
				</button>
				{fileOpen && (
					<div
						style={{
							position: 'absolute',
							top: '100%',
							left: 0,
							background: xp.menuBg,
							border: '1px solid #808080',
							borderTop: 'none',
							boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
							minWidth: '160px',
							zIndex: 200,
						}}
					>
						{[
							{ label: 'Export 1x  (1024×1024)', scale: 1 as const },
							{ label: 'Export 2x  (2048×2048)', scale: 2 as const },
							{ label: 'Export 4x  (4096×4096)', scale: 4 as const },
						].map(({ label, scale }) => (
							<button
								key={scale}
								onClick={() => handleExport(scale)}
								style={{
									display: 'block',
									width: '100%',
									textAlign: 'left',
									background: 'transparent',
									border: 'none',
									fontFamily: xp.font,
									fontSize: xp.fontSize,
									padding: '4px 16px',
									cursor: 'default',
									color: '#000',
								}}
								onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = xp.activeToolBg; }}
								onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
							>
								{label}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Other decorative menu items */}
			{['Edit', 'View', 'Help'].map((item) => (
				<button
					key={item}
					style={{
						background: 'transparent',
						border: 'none',
						fontFamily: xp.font,
						fontSize: xp.fontSize,
						padding: '2px 8px',
						cursor: 'default',
						color: '#000',
					}}
					tabIndex={-1}
				>
					{item}
				</button>
			))}
		</div>
	);
}
