import { Point } from './cross-code-map';

export interface MapStyles {
	default: MapStyleType;
	
	[key: string]: MapStyleType | undefined;
}

export interface MapStyleType {
	[key: string]: MapStyle | undefined;
}

export interface MapStyle {
	sheet?: string;
	x?: number;
	y?: number;
	hasDoorMat?: boolean;
	doorGlow?: DoorGlow;
	doorVariations?: Record<string, DoorVariation | undefined>;
	stairDoor?: Point;
	teleportField?: TeleportField;
	colors?: WallColors;
}

export interface TeleportField {
	x: number;
	y: number;
	xCount: number;
	zHeight?: number;
}

export interface WallColors {
	blockFront: string;
	blockTop: string;
	pBlockFront: string;
	pBlockTop: string;
	npBlockFront: string;
	npBlockTop: string;
}

export interface DoorGlow {
	x: number;
	y: number;
	xCount: number;
	sideX?: number;
	sideY?: number;
}

export interface DoorVariation {
	x?: number;
	y?: number;
	doorMat?: boolean;
	doorGlow?: DoorGlow;
}
