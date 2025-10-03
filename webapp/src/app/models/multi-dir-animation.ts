import { TileSheet } from './tile-sheet';

export interface MultiDirAnimation {
	DOCTYPE: 'MULTI_DIR_ANIMATION';
	name: string;
	namedSheets: Record<string, TileSheet>;
	frames: number[];
	sheet: TileSheet | string;
	dirs: number;
	tileOffsets?: number[];
}
