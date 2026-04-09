// Types for the mascot customization editor

export interface RegionSettings {
	color: string;
	opacity: number;
}

export interface PatternSettings {
	type: 'none' | 'squiggly' | 'stripes' | 'dots' | 'stars';
	color: string;
	opacity: number;
	rotation: number;
}

export interface BodyRegion extends RegionSettings {
	pattern: PatternSettings;
}

export interface EyesRegion extends RegionSettings { }

export interface RegionsData {
	body: BodyRegion;
	back: BodyRegion;
	eyes: EyesRegion;
}

export interface LayerData {
	id: number;
	visible: boolean;
	maskMode: 'unmasked' | 'mask-in' | 'mask-out';
	strokes: StrokeData[];
}

export interface StrokeData {
	tool: 'brush' | 'eraser' | 'stamp' | 'text';
	points?: number[];
	color?: string;
	size: number;
	opacity: number;
	shape?: string;
	rotation?: number;
	x?: number;
	y?: number;
}

export interface CustomizationData {
	regions: RegionsData;
	layers: LayerData[];
}

export type Tool = 'brush' | 'eraser' | 'stamp' | 'text' | 'picker';
export type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

export const DEFAULT_REGIONS: RegionsData = {
	body: {
		color: '#8B6914',
		opacity: 1.0,
		pattern: { type: 'none', color: '#000000', opacity: 1.0, rotation: 0 },
	},
	back: {
		color: '#6B4F12',
		opacity: 1.0,
		pattern: { type: 'none', color: '#000000', opacity: 1.0, rotation: 0 },
	},
	eyes: {
		color: '#FFFFFF',
		opacity: 1.0,
	},
};

export const DEFAULT_LAYERS: LayerData[] = [
	{ id: 2, visible: true, maskMode: 'unmasked', strokes: [] },
	{ id: 3, visible: true, maskMode: 'unmasked', strokes: [] },
	{ id: 4, visible: false, maskMode: 'unmasked', strokes: [] },
];

export const APPROVED_COLORS = [
	// Warm
	'#E63946', '#F4A261', '#E9C46A', '#F2CC8F',
	// Cool
	'#264653', '#2A9D8F', '#457B9D', '#90BE6D',
	// Neutral
	'#6D6875', '#B5838D', '#FFCDB2', '#DDB892',
	// Bold
	'#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0',
	// Earth
	'#606C38', '#283618', '#DDA15E', '#BC6C25',
];

export const CANVAS_SIZE = 1024;
