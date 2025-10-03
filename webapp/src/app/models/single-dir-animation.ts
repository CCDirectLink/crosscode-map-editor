import { TileSheet } from './tile-sheet';

export interface SingleDirAnimation {
	flipX: boolean;
	flipY: boolean;
	/** Actually a string[] but used as index for an array */
	frames: number[];
	framesAngle: number[];
	framesSpriteOffset: number[];
	name: string;
	repeat: boolean;
	sheet: string | TileSheet;
	time: number;
	wallY: number;
}
