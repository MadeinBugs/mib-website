'use client';

import { xp, sunkenStyle, raisedStyle } from './xpStyles';
import type { RegionsData, BodyRegion, EyesRegion, PatternSettings } from './types';

type RegionKey = 'body' | 'back' | 'eyes';

interface RegionControlsProps {
	regions: RegionsData;
	activeRegion: RegionKey;
	onActiveRegionChange: (region: RegionKey) => void;
	onRegionUpdate: (region: RegionKey, updates: Partial<BodyRegion> | Partial<EyesRegion>) => void;
}

const PATTERN_TYPES: { value: PatternSettings['type']; label: string }[] = [
	{ value: 'none', label: 'None' },
	{ value: 'squiggly', label: 'Squiggly' },
	{ value: 'stripes', label: 'Stripes' },
	{ value: 'dots', label: 'Dots' },
	{ value: 'stars', label: 'Stars' },
];

export default function RegionControls({
	regions,
	activeRegion,
	onActiveRegionChange,
	onRegionUpdate,
}: RegionControlsProps) {
	const current = regions[activeRegion];
	const hasPattern = activeRegion === 'body' || activeRegion === 'back';
	const pattern = hasPattern ? (current as BodyRegion).pattern : null;

	const updatePattern = (updates: Partial<PatternSettings>) => {
		if (!hasPattern || !pattern) return;
		onRegionUpdate(activeRegion, {
			pattern: { ...pattern, ...updates },
		} as Partial<BodyRegion>);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '4px',
				padding: '4px 6px',
				fontFamily: xp.font,
				fontSize: xp.fontSize,
				background: xp.bg,
				borderTop: `1px solid ${xp.border}`,
			}}
		>
			{/* Row 1: Region, Color, Opacity */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
					<div style={{ position: 'relative', width: '80px', height: '20px', ...sunkenStyle(), background: '#FFFFFF', padding: '0 2px' }}>
						<div style={{ position: 'absolute', top: '50%', left: '4px', right: '4px', height: '2px', background: '#808080', transform: 'translateY(-50%)' }} />
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
							className="xp-slider"
							style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
						/>
					</div>
					<span style={{ fontSize: '10px', minWidth: '28px' }}>
						{Math.round(current.opacity * 100)}%
					</span>
				</div>
			</div>

			{/* Row 2: Pattern controls (body/back only) */}
			{hasPattern && pattern && (
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
					{/* Pattern type */}
					<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<label style={{ fontSize: '10px', color: '#444' }}>Pattern:</label>
						<select
							value={pattern.type}
							onChange={(e) => updatePattern({ type: e.target.value as PatternSettings['type'] })}
							style={{
								fontFamily: xp.font,
								fontSize: xp.fontSize,
								padding: '1px 4px',
								background: xp.bgLight,
								...sunkenStyle(),
							}}
						>
							{PATTERN_TYPES.map((pt) => (
								<option key={pt.value} value={pt.value}>{pt.label}</option>
							))}
						</select>
					</div>

					{pattern.type !== 'none' && (
						<>
							{/* Pattern color */}
							<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
								<label style={{ fontSize: '10px', color: '#444' }}>P.Color:</label>
								<input
									type="color"
									value={pattern.color}
									onChange={(e) => updatePattern({ color: e.target.value })}
									style={{
										width: '24px',
										height: '20px',
										padding: 0,
										border: '1px solid #808080',
										cursor: 'pointer',
									}}
								/>
							</div>

							{/* Pattern opacity */}
							<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
								<label style={{ fontSize: '10px', color: '#444' }}>P.Opacity:</label>
								<div style={{ position: 'relative', width: '60px', height: '20px', ...sunkenStyle(), background: '#FFFFFF', padding: '0 2px' }}>
									<div style={{ position: 'absolute', top: '50%', left: '4px', right: '4px', height: '2px', background: '#808080', transform: 'translateY(-50%)' }} />
									<input
										type="range"
										min={0}
										max={100}
										value={Math.round(pattern.opacity * 100)}
										onChange={(e) => updatePattern({ opacity: parseInt(e.target.value) / 100 })}
										className="xp-slider"
										style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
									/>
								</div>
								<span style={{ fontSize: '10px', minWidth: '28px' }}>
									{Math.round(pattern.opacity * 100)}%
								</span>
							</div>

							{/* Pattern rotation */}
							<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
								<label style={{ fontSize: '10px', color: '#444' }}>Rot:</label>
								<div style={{ position: 'relative', width: '60px', height: '20px', ...sunkenStyle(), background: '#FFFFFF', padding: '0 2px' }}>
									<div style={{ position: 'absolute', top: '50%', left: '4px', right: '4px', height: '2px', background: '#808080', transform: 'translateY(-50%)' }} />
									<input
										type="range"
										min={0}
										max={360}
										value={pattern.rotation}
										onChange={(e) => updatePattern({ rotation: parseInt(e.target.value) })}
										className="xp-slider"
										style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1, cursor: 'pointer' }}
									/>
								</div>
								<span style={{ fontSize: '10px', minWidth: '28px' }}>
									{pattern.rotation}°
								</span>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}
