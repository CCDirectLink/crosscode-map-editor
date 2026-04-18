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
