'use client';

import { xp, raisedStyle } from './xpStyles';

interface XPTitleBarProps {
	title: string;
}

export default function XPTitleBar({ title }: XPTitleBarProps) {
	return (
		<div
			style={{
				background: `linear-gradient(to right, ${xp.titleGradientStart}, ${xp.titleGradientEnd})`,
				color: xp.titleText,
				fontFamily: xp.font,
				fontSize: '12px',
				fontWeight: 'bold',
				padding: '3px 4px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				userSelect: 'none',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<span style={{ fontSize: '14px', lineHeight: 1 }}>🎨</span>
				<span style={{ fontFamily: "'Homemade Apple', cursive", fontSize: '13px', color: '#FF69B4', lineHeight: 1, paddingTop: '4px', display: 'inline-block' }}>{title}</span>
			</div>
			<div style={{ display: 'flex', gap: '2px' }}>
				{['—', '□', '×'].map((btn) => (
					<button
						key={btn}
						style={{
							width: '21px',
							height: '21px',
							background: xp.bg,
							border: 'none',
							fontFamily: xp.font,
							fontSize: '11px',
							lineHeight: '1',
							cursor: 'default',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							...raisedStyle(),
						}}
						tabIndex={-1}
						aria-hidden
					>
						{btn}
					</button>
				))}
			</div>
		</div>
	);
}
