// Windows XP Paint shared style constants

export const xp = {
	// Colors
	bg: '#D4D0C8',
	bgDark: '#808080',
	bgLight: '#FFFFFF',
	titleGradientStart: '#0A246A',
	titleGradientEnd: '#3A6EA5',
	titleText: '#FFFFFF',
	menuBg: '#ECE9D8',
	statusBg: '#ECE9D8',
	border: '#808080',
	borderLight: '#DFDFDF',
	borderDark: '#404040',
	activeToolBg: '#B8D0E8',

	// Fonts
	font: 'Tahoma, "Segoe UI", system-ui, sans-serif',
	fontSize: '11px',

	// Borders — classic 3D beveled look
	raised: {
		borderTop: '1px solid #FFFFFF',
		borderLeft: '1px solid #FFFFFF',
		borderBottom: '1px solid #808080',
		borderRight: '1px solid #808080',
	},
	sunken: {
		borderTop: '1px solid #808080',
		borderLeft: '1px solid #808080',
		borderBottom: '1px solid #FFFFFF',
		borderRight: '1px solid #FFFFFF',
	},
} as const;

// Helper to apply raised 3D border
export function raisedStyle(): React.CSSProperties {
	return {
		borderTop: xp.raised.borderTop,
		borderLeft: xp.raised.borderLeft,
		borderBottom: xp.raised.borderBottom,
		borderRight: xp.raised.borderRight,
	};
}

// Helper to apply sunken 3D border
export function sunkenStyle(): React.CSSProperties {
	return {
		borderTop: xp.sunken.borderTop,
		borderLeft: xp.sunken.borderLeft,
		borderBottom: xp.sunken.borderBottom,
		borderRight: xp.sunken.borderRight,
	};
}
