'use client';

import { xp, sunkenStyle, raisedStyle } from './xpStyles';
import type { RegionsData, BodyRegion, EyesRegion } from './types';

type RegionKey = 'body' | 'back' | 'eyes';

interface RegionControlsProps {
	regions: RegionsData;
	activeRegion: RegionKey;
	onActiveRegionChange: (region: RegionKey) => void;
	onRegionUpdate: (region: RegionKey, updates: Partial<BodyRegion> | Partial<EyesRegion>) => void;
}

export default function RegionControls({
	regions,
	activeRegion,
	onActiveRegionChange,
	onRegionUpdate,
}: RegionControlsProps) {
	const current = regions[activeRegion];

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '12px',
				fontFamily: xp.font,
				fontSize: xp.fontSize,
			}}
		>
			{/* Region selector */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<label style={{ fontSize: '10px', color: '#444' }}>Region:</label>
				<select
					value={activeRegion}
					onChange={(e) => onActiveRegionChange(e.target.value as RegionKey)}
					style={{
						fontFamily: xp.font,
						fontSize: xp.fontSize,
						padding: '1px 4px',
						background: xp.bgLight,
						...sunkenStyle(),
					}}
				>
					<option value="body">Body</option>
					<option value="back">Back</option>
					<option value="eyes">Eyes</option>
				</select>
			</div>

			{/* Color picker + hex */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<label style={{ fontSize: '10px', color: '#444' }}>Color:</label>
				<input
					type="color"
					value={current.color}
					onChange={(e) =>
						onRegionUpdate(activeRegion, { color: e.target.value })
					}
					style={{
						width: '24px',
						height: '20px',
						padding: 0,
						border: '1px solid #808080',
						cursor: 'pointer',
					}}
				/>
				<input
					type="text"
					value={current.color}
					onChange={(e) => {
						const val = e.target.value;
						if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
							onRegionUpdate(activeRegion, { color: val });
						}
					}}
					maxLength={7}
					style={{
						width: '64px',
						fontFamily: xp.font,
						fontSize: '10px',
						padding: '1px 3px',
						background: xp.bgLight,
						...sunkenStyle(),
					}}
				/>
			</div>

			{/* Opacity slider */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<label style={{ fontSize: '10px', color: '#444' }}>Opacity:</label>
				<input
					type="range"
					min={0}
					max={100}
					value={Math.round(current.opacity * 100)}
					onChange={(e) =>
						onRegionUpdate(activeRegion, {
							opacity: parseInt(e.target.value) / 100,
						})
					}
					style={{ width: '80px', accentColor: xp.titleGradientEnd }}
				/>
				<span style={{ fontSize: '10px', minWidth: '28px' }}>
					{Math.round(current.opacity * 100)}%
				</span>
			</div>
		</div>
	);
}
