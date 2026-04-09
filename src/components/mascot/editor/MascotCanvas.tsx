'use client';

import { useRef, useEffect, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Text as KonvaText, Ellipse, Circle, Group } from 'react-konva';
import type Konva from 'konva';
import type { RegionsData, LayerData, StrokeData, Tool } from './types';
import { CANVAS_SIZE, MASCOT_ASSETS } from './types';

interface MascotCanvasProps {
	regions: RegionsData;
	layers: LayerData[];
	activeLayerId: number;
	activeTool: Tool;
	brushSize: number;
	brushColor: string;
	brushOpacity: number;
	onCursorMove: (x: number, y: number) => void;
	onStrokeComplete: (layerId: number, stroke: StrokeData) => void;
	onPickColor: (color: string) => void;
}

export interface MascotCanvasHandle {
	getStage: () => Konva.Stage | null;
}

function useImage(src: string): HTMLImageElement | null {
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	useEffect(() => {
		const img = new window.Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => setImage(img);
		img.onerror = () => setImage(null);
		img.src = src;
		return () => { img.onload = null; img.onerror = null; };
	}, [src]);
	return image;
}

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
		ctx.globalAlpha = opacity;
		ctx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		ctx.globalCompositeOperation = 'destination-in';
		ctx.globalAlpha = opacity;
		ctx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
		return canvas;
	}, [image, color, opacity]);
}

function StrokeRenderer({ stroke }: { stroke: StrokeData }) {
	if (stroke.tool === 'text' && stroke.x != null && stroke.y != null) {
		return (
			<KonvaText
				x={stroke.x}
				y={stroke.y}
				text="A"
				fontSize={stroke.size * 4}
				fontFamily="serif"
				fontStyle="bold"
				fill={stroke.color || '#000'}
				opacity={stroke.opacity}
			/>
		);
	}
	if (!stroke.points || stroke.points.length < 2) return null;
	return (
		<Line
			points={stroke.points}
			stroke={stroke.color || '#000'}
			strokeWidth={stroke.size}
			opacity={stroke.tool === 'eraser' ? 1 : stroke.opacity}
			lineCap="round"
			lineJoin="round"
			globalCompositeOperation={stroke.tool === 'eraser' ? 'destination-out' : 'source-over'}
		/>
	);
}

const MascotCanvas = forwardRef<MascotCanvasHandle, MascotCanvasProps>(function MascotCanvas(
	{
		regions,
		layers,
		activeLayerId,
		activeTool,
		brushSize,
		brushColor,
		brushOpacity,
		onCursorMove,
		onStrokeComplete,
		onPickColor,
	},
	ref
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<Konva.Stage>(null);
	const [scale, setScale] = useState(1);
	const isDrawingRef = useRef(false);
	const [currentStroke, setCurrentStroke] = useState<StrokeData | null>(null);

	useImperativeHandle(ref, () => ({
		getStage: () => stageRef.current,
	}));

	const bodyImg = useImage(MASCOT_ASSETS.body);
	const backImg = useImage(MASCOT_ASSETS.back);
	const eyesImg = useImage(MASCOT_ASSETS.eyes);
	const outlinesImg = useImage(MASCOT_ASSETS.outlines);

	const tintedBody = useTintedCanvas(bodyImg, regions.body.color, regions.body.opacity);
	const tintedBack = useTintedCanvas(backImg, regions.back.color, regions.back.opacity);
	const tintedEyes = useTintedCanvas(eyesImg, regions.eyes.color, regions.eyes.opacity);

	const assetsLoaded = !!(bodyImg && backImg && eyesImg && outlinesImg);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setScale(Math.min(width / CANVAS_SIZE, height / CANVAS_SIZE, 1));
		});
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	const getPointerPos = useCallback(() => {
		const stage = stageRef.current;
		if (!stage) return null;
		const pos = stage.getPointerPosition();
		if (!pos) return null;
		return { x: Math.round(pos.x / scale), y: Math.round(pos.y / scale) };
	}, [scale]);

	const handleMouseDown = useCallback(() => {
		const pos = getPointerPos();
		if (!pos) return;

		if (activeTool === 'picker') {
			const stage = stageRef.current;
			if (!stage) return;
			const compositeCanvas = stage.toCanvas({ pixelRatio: 1 });
			const ctx = compositeCanvas.getContext('2d');
			if (ctx) {
				const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
				const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(c => c.toString(16).padStart(2, '0')).join('');
				onPickColor(hex);
			}
			return;
		}

		if (activeTool === 'text') {
			const stroke: StrokeData = {
				tool: 'text',
				x: pos.x - brushSize * 2,
				y: pos.y - brushSize * 2,
				size: brushSize,
				opacity: brushOpacity,
				color: brushColor,
			};
			onStrokeComplete(activeLayerId, stroke);
			return;
		}

		if (activeTool === 'brush' || activeTool === 'eraser') {
			isDrawingRef.current = true;
			setCurrentStroke({
				tool: activeTool,
				points: [pos.x, pos.y],
				color: activeTool === 'eraser' ? undefined : brushColor,
				size: brushSize,
				opacity: activeTool === 'eraser' ? 1 : brushOpacity,
			});
		}
	}, [activeTool, brushSize, brushColor, brushOpacity, activeLayerId, getPointerPos, onStrokeComplete, onPickColor]);

	const handleMouseMove = useCallback((e: unknown) => {
		const pos = getPointerPos();
		if (pos) {
			onCursorMove(
				Math.max(0, Math.min(pos.x, CANVAS_SIZE)),
				Math.max(0, Math.min(pos.y, CANVAS_SIZE))
			);
		}
		if (!isDrawingRef.current || !pos) return;
		setCurrentStroke((prev) => {
			if (!prev || !prev.points) return prev;
			return { ...prev, points: [...prev.points, pos.x, pos.y] };
		});
	}, [getPointerPos, onCursorMove]);

	const handleMouseUp = useCallback(() => {
		if (!isDrawingRef.current || !currentStroke) {
			isDrawingRef.current = false;
			return;
		}
		isDrawingRef.current = false;
		onStrokeComplete(activeLayerId, currentStroke);
		setCurrentStroke(null);
	}, [currentStroke, activeLayerId, onStrokeComplete]);

	const cursorStyle = activeTool === 'picker' ? 'crosshair' : activeTool === 'text' ? 'text' : 'crosshair';
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
				ref={stageRef}
				width={CANVAS_SIZE * scale}
				height={CANVAS_SIZE * scale}
				scaleX={scale}
				scaleY={scale}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				style={{ cursor: cursorStyle }}
			>
				{assetsLoaded ? (
					<>
						{/* Layer 0: Body + Back (tinted PNGs) */}
						<Layer listening={false}>
							{tintedBack && <KonvaImage image={tintedBack} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />}
							{tintedBody && <KonvaImage image={tintedBody} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />}
						</Layer>

						{/* Layer 1: Eyes (tinted PNG) */}
						<Layer listening={false}>
							{tintedEyes && <KonvaImage image={tintedEyes} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />}
						</Layer>

						{/* Layer 2: Patterns — implemented in Phase C */}
						<Layer listening={false} />

						{/* Layer 3: Outlines & details */}
						<Layer listening={false}>
							<KonvaImage image={outlinesImg} x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} />
						</Layer>

						{/* Layers 4, 5, 6: Drawable layers */}
						{layers.map((layer) => (
							<Layer key={layer.id} visible={layer.visible} listening={layer.id === activeLayerId}>
								{layer.strokes.map((stroke, i) => (
									<StrokeRenderer key={i} stroke={stroke} />
								))}
								{currentStroke && layer.id === activeLayerId && (
									<StrokeRenderer stroke={currentStroke} />
								)}
							</Layer>
						))}
					</>
				) : (
					<>
						<Layer listening={false}>
							<Ellipse x={cx} y={cy + 40} radiusX={220} radiusY={280} fill={regions.body.color} opacity={regions.body.opacity} stroke="#000" strokeWidth={3} />
							<Ellipse x={cx} y={cy - 40} radiusX={180} radiusY={200} fill={regions.back.color} opacity={regions.back.opacity} stroke="#000" strokeWidth={3} />
							<Group>
								<Circle x={cx - 60} y={cy - 80} radius={35} fill={regions.eyes.color} opacity={regions.eyes.opacity} stroke="#000" strokeWidth={3} />
								<Circle x={cx - 50} y={cy - 80} radius={12} fill="#000" />
								<Circle x={cx + 60} y={cy - 80} radius={35} fill={regions.eyes.color} opacity={regions.eyes.opacity} stroke="#000" strokeWidth={3} />
								<Circle x={cx + 70} y={cy - 80} radius={12} fill="#000" />
							</Group>
							{[[-140, 180, -200, 300], [-80, 220, -100, 340], [80, 220, 100, 340], [140, 180, 200, 300]].map(([x1, y1, x2, y2], i) => (
								<Line key={i} points={[cx + x1, cy + y1, cx + x2, cy + y2]} stroke="#000" strokeWidth={12} lineCap="round" />
							))}
							<Line points={[cx - 40, cy - 240, cx - 80, cy - 340]} stroke="#000" strokeWidth={4} lineCap="round" />
							<Circle x={cx - 80} y={cy - 345} radius={8} fill={regions.body.color} opacity={regions.body.opacity} stroke="#000" strokeWidth={3} />
							<Line points={[cx + 40, cy - 240, cx + 80, cy - 340]} stroke="#000" strokeWidth={4} lineCap="round" />
							<Circle x={cx + 80} y={cy - 345} radius={8} fill={regions.body.color} opacity={regions.body.opacity} stroke="#000" strokeWidth={3} />
							<KonvaText x={cx - 180} y={cy + 340} width={360} text="⚠ Place artist PNGs in /public/assets/mascot/" fontSize={16} fontFamily="Tahoma, sans-serif" fill="#888" align="center" />
						</Layer>
					</>
				)}
			</Stage>
		</div>
	);
});

export default MascotCanvas;
