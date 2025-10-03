export interface MapStyles {
	default: MapStyleType;

	[key: string]: MapStyleType | undefined;
}

export type MapStyleType = Record<string, MapStyle | undefined>;

export interface MapStyle {
	sheet?: string;
}
