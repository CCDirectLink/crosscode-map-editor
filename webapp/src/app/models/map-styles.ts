export interface MapStyles {
	default: MapStyleType;
	
	[key: string]: MapStyleType | undefined;
}

export interface MapStyleType {
	[key: string]: MapStyle | undefined;
}

export interface MapStyle {
	sheet?: string;
}
