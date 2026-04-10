'use client';

import { xp, raisedStyle, sunkenStyle } from './xpStyles';
import { APPROVED_COLORS } from './types';

interface XPColorPaletteProps {
	selectedColor: string;
	onColorSelect: (color: string) => void;
}

export default function XPColorPalette({
	selectedColor,
	onColorSelect,
}: XPColorPaletteProps) {
	// XP Paint-style: two rows of swatches
	const topRow = APPROVED_COLORS.slice(0, 10);
	const bottomRow = APPROVED_COLORS.slice(10);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '6px',
			}}
		>
			{/* Current / previous color display */}
			<div
				style={{
					position: 'relative',
					width: '28px',
					height: '28px',
					...sunkenStyle(),
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: '2px',
						background: selectedColor,
					}}
				/>
			</div>

			{/* Swatch grid */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
				<div style={{ display: 'flex', gap: '1px' }}>
					{topRow.map((color) => (
						<button
							key={color}
							title={color}
							onClick={() => onColorSelect(color)}
							style={{
								width: '16px',
								height: '16px',
								background: color,
								border:
									color === selectedColor
										? '2px solid #000'
										: '1px solid #808080',
								cursor: 'pointer',
								padding: 0,
							}}
						/>
					))}
				</div>
				<div style={{ display: 'flex', gap: '1px' }}>
					{bottomRow.map((color) => (
						<button
							key={color}
							title={color}
							onClick={() => onColorSelect(color)}
							style={{
								width: '16px',
								height: '16px',
								background: color,
								border:
									color === selectedColor
										? '2px solid #000'
										: '1px solid #808080',
								cursor: 'pointer',
								padding: 0,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
