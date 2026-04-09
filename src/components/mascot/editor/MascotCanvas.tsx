'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Ellipse, Rect, Circle, Line, Group } from 'react-konva';
import type { RegionsData } from './types';
import { CANVAS_SIZE } from './types';

interface MascotCanvasProps {
	regions: RegionsData;
	onCursorMove: (x: number, y: number) => void;
}

export default function MascotCanvas({
	regions,
	onCursorMove,
}: MascotCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	// Responsive scaling: fit canvas to container
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			const s = Math.min(width / CANVAS_SIZE, height / CANVAS_SIZE, 1);
			setScale(s);
		});

		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	const handleMouseMove = useCallback(
		(e: { evt: MouseEvent }) => {
			if (!containerRef.current) return;
			const stage = e.evt.target as HTMLCanvasElement;
			const rect = stage.getBoundingClientRect();
			const x = Math.round((e.evt.clientX - rect.left) / scale);
			const y = Math.round((e.evt.clientY - rect.top) / scale);
			onCursorMove(
				Math.max(0, Math.min(x, CANVAS_SIZE)),
				Math.max(0, Math.min(y, CANVAS_SIZE))
			);
		},
		[scale, onCursorMove]
	);

	// Center coordinates
	const cx = CANVAS_SIZE / 2;
	const cy = CANVAS_SIZE / 2;

	return (
		<div
			ref={containerRef}
			style={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				background: '#FFFFFF',
			}}
		>
			<Stage
				width={CANVAS_SIZE * scale}
				height={CANVAS_SIZE * scale}
				scaleX={scale}
				scaleY={scale}
				onMouseMove={handleMouseMove}
				style={{ cursor: 'crosshair' }}
			>
				{/* Layer 0: Sisyphus base (placeholder shapes) */}
				<Layer listening={false}>
					{/* Body - main body ellipse */}
					<Ellipse
						x={cx}
						y={cy + 40}
						radiusX={220}
						radiusY={280}
						fill={regions.body.color}
						opacity={regions.body.opacity}
						stroke="#000"
						strokeWidth={3}
					/>

					{/* Back - shell/back region */}
					<Ellipse
						x={cx}
						y={cy - 40}
						radiusX={180}
						radiusY={200}
						fill={regions.back.color}
						opacity={regions.back.opacity}
						stroke="#000"
						strokeWidth={3}
					/>

					{/* Eyes - two circles */}
					<Group>
						<Circle
							x={cx - 60}
							y={cy - 80}
							radius={35}
							fill={regions.eyes.color}
							opacity={regions.eyes.opacity}
							stroke="#000"
							strokeWidth={3}
						/>
						{/* Pupil left */}
						<Circle
							x={cx - 50}
							y={cy - 80}
							radius={12}
							fill="#000"
						/>
						<Circle
							x={cx + 60}
							y={cy - 80}
							radius={35}
							fill={regions.eyes.color}
							opacity={regions.eyes.opacity}
							stroke="#000"
							strokeWidth={3}
						/>
						{/* Pupil right */}
						<Circle
							x={cx + 70}
							y={cy - 80}
							radius={12}
							fill="#000"
						/>
					</Group>

					{/* Legs - simple lines */}
					{[
						[-140, 180, -200, 300],
						[-80, 220, -100, 340],
						[80, 220, 100, 340],
						[140, 180, 200, 300],
					].map(([x1, y1, x2, y2], i) => (
						<Line
							key={i}
							points={[cx + x1, cy + y1, cx + x2, cy + y2]}
							stroke="#000"
							strokeWidth={12}
							lineCap="round"
						/>
					))}

					{/* Antennae */}
					<Line
						points={[cx - 40, cy - 240, cx - 80, cy - 340]}
						stroke="#000"
						strokeWidth={4}
						lineCap="round"
					/>
					<Circle
						x={cx - 80}
						y={cy - 345}
						radius={8}
						fill={regions.body.color}
						opacity={regions.body.opacity}
						stroke="#000"
						strokeWidth={3}
					/>
					<Line
						points={[cx + 40, cy - 240, cx + 80, cy - 340]}
						stroke="#000"
						strokeWidth={4}
						lineCap="round"
					/>
					<Circle
						x={cx + 80}
						y={cy - 345}
						radius={8}
						fill={regions.body.color}
						opacity={regions.body.opacity}
						stroke="#000"
						strokeWidth={3}
					/>

					{/* Placeholder label */}
					{/* Text rendered via a simple rect overlay - actual SVG will replace all of this */}
				</Layer>
			</Stage>
		</div>
	);
}
