'use client';

import { xp, raisedStyle } from './xpStyles';

interface XPMenuBarProps {
	onExport?: () => void;
}

export default function XPMenuBar({ onExport }: XPMenuBarProps) {
	const menuItems = ['File', 'Edit', 'View', 'Help'];

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
			}}
		>
			{menuItems.map((item) => (
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
