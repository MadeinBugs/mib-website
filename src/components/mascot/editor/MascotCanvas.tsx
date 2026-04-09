'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Ellipse, Circle, Line, Group, Rect, Text } from 'react-konva';
import type { RegionsData } from './types';
import { CANVAS_SIZE, MASCOT_ASSETS } from './types';

interface MascotCanvasProps {
	regions: RegionsData;
	onCursorMove: (x: number, y: number) => void;
}

// Hook to load an image from a URL, returns null if not yet loaded or failed
function useImage(src: string): HTMLImageElement | null {
	const [image, setImage] = useState<HTMLImageElement | null>(null);

	useEffect(() => {
		const img = new window.Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => setImage(img);
		img.onerror = () => setImage(null);
		img.src = src;
		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [src]);

	return image;
}

// Create a tinted version of an image by compositing color through it
// Uses an offscreen canvas with 'multiply' blend mode
function useTintedCanvas(
	image: HTMLImageElement | null,
	color: string,
	opacity: number
): HTMLCanvasElement | null {
	return useMemo(() => {
		if (!image) return null;

		const canvas = document.createElement('canvas');
		canvas.width = CANVAS_SIZE;
		canvas.height = CANVAS_SIZE;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		// Draw the white region PNG
		ctx.globalAlpha = opacity;
		ctx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Multiply with the chosen color — white pixels become the color, transparent stays transparent
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Restore alpha from original image (multiply doesn't preserve it)
		ctx.globalCompositeOperation = 'destination-in';
		ctx.globalAlpha = opacity;
		ctx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

		return canvas;
	}, [image, color, opacity]);
}

export default function MascotCanvas({
	regions,
	onCursorMove,
}: MascotCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	// Load artist PNGs
	const bodyImg = useImage(MASCOT_ASSETS.body);
	const backImg = useImage(MASCOT_ASSETS.back);
	const eyesImg = useImage(MASCOT_ASSETS.eyes);
	const outlinesImg = useImage(MASCOT_ASSETS.outlines);

	// Create tinted canvases for each region
	const tintedBody = useTintedCanvas(bodyImg, regions.body.color, regions.body.opacity);
	const tintedBack = useTintedCanvas(backImg, regions.back.color, regions.back.opacity);
	const tintedEyes = useTintedCanvas(eyesImg, regions.eyes.color, regions.eyes.opacity);

	const assetsLoaded = !!(bodyImg && backImg && eyesImg && outlinesImg);

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

	// Center coordinates for placeholder shapes
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
				{assetsLoaded ? (
					<>
						{/* Layer 0: Body + Back (tinted PNGs) */}
						<Layer listening={false}>
							{tintedBack && (
								<KonvaImage image={tintedBack} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />
							)}
							{tintedBody && (
								<KonvaImage image={tintedBody} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />
							)}
						</Layer>

						{/* Layer 1: Eyes (tinted PNG) */}
						<Layer listening={false}>
							{tintedEyes && (
								<KonvaImage image={tintedEyes} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />
							)}
						</Layer>

						{/* Layer 2: Patterns — placeholder, implemented in Phase C */}
						<Layer listening={false} />

						{/* Layer 3: Outlines & details (untinted) */}
						<Layer listening={false}>
							<KonvaImage image={outlinesImg} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />
						</Layer>

						{/* Layers 4, 5, 6: Drawable — placeholder, implemented in Phase B */}
						<Layer />
					</>
				) : (
					<>
						{/* Placeholder shapes while PNGs are not yet available */}
						<Layer listening={false}>
							{/* Body */}
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
							{/* Back/shell */}
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
							{/* Eyes */}
							<Group>
								<Circle x={cx - 60} y={cy - 80} radius={35} fill={regions.eyes.color} opacity={regions.eyes.opacity} stroke="#000" strokeWidth={3} />
								<Circle x={cx - 50} y={cy - 80} radius={12} fill="#000" />
								<Circle x={cx + 60} y={cy - 80} radius={35} fill={regions.eyes.color} opacity={regions.eyes.opacity} stroke="#000" strokeWidth={3} />
								<Circle x={cx + 70} y={cy - 80} radius={12} fill="#000" />
							</Group>
							{/* Legs */}
							{[[-140, 180, -200, 300], [-80, 220, -100, 340], [80, 220, 100, 340], [140, 180, 200, 300]].map(([x1, y1, x2, y2], i) => (
								<Line key={i} points={[cx + x1, cy + y1, cx + x2, cy + y2]} stroke="#000" strokeWidth={12} lineCap="round" />
							))}
							{/* Antennae */}
							<Line points={[cx - 40, cy - 240, cx - 80, cy - 340]} stroke="#000" strokeWidth={4} lineCap="round" />
							<Circle x={cx - 80} y={cy - 345} radius={8} fill={regions.body.color} opacity={regions.body.opacity} stroke="#000" strokeWidth={3} />
							<Line points={[cx + 40, cy - 240, cx + 80, cy - 340]} stroke="#000" strokeWidth={4} lineCap="round" />
							<Circle x={cx + 80} y={cy - 345} radius={8} fill={regions.body.color} opacity={regions.body.opacity} stroke="#000" strokeWidth={3} />
							{/* Label */}
							<Text
								x={cx - 180}
								y={cy + 340}
								width={360}
								text="⚠ Place artist PNGs in /public/assets/mascot/"
								fontSize={16}
								fontFamily="Tahoma, sans-serif"
								fill="#888"
								align="center"
							/>
						</Layer>
					</>
				)}
			</Stage>
		</div>
	);
}
