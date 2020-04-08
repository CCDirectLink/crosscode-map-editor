export type MapStyles = {
	walls: WallColors;
} & {
	[key: string]: MapStyle;
};

export type MapStyle = {
	sheet: string;
	hasDoorMat?: boolean;
} & {
	[key: string]: any
};

export interface WallColors {
	blockFront: string;
	blockTop: string;
	pBlockFront: string;
	pBlockTop: string;
	npBlockFront: string;
	npBlockTop: string;
}
