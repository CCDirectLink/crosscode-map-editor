import {FILL_TYPE, GFX_TYPE} from '../heightmap.constants';
import {Point} from '../../../models/cross-code-map';

export interface ChipsetConfig {
	tileCountX: number;
	base: ChipsetBase;
	terrains?: ChipsetBase[];
	mappingType?: string;
}

export interface ChipsetBase {
	ground: Point;
	cliff: Point;
	cliffAlt?: Point;
	mappingType?: string;
	blockedTypes?: GFX_TYPE[];
	chasmOnly?: boolean;
	border?: boolean;
	shadow?: Point;
	baseTerrain?: number;
	overrideWallBase?: boolean;
	wallTerrainPrio?: number;
}

export interface GfxMaps {
	BASE: GfxMap;
	ALT: GfxMap;
	SHADOW: GfxMap;
	CHASM: GfxMapChasm;
	DARK_WALL: GfxMap;
	CHASM_FLOOR: GfxMapChasm;
	BACK_WALL: GfxMap;
	
	SUB: {
		BASE: GfxMap;
		SHADOW: GfxMap;
		BACK_WALL: GfxMap;
		BORDER: {
			[key in GFX_TYPE]: number[][][];
		};
		CHASM_FLOOR?: GfxMap;
		ignoreTerrain?: GFX_TYPE[];
		ignoreTerrainKeepWallBase?: GFX_TYPE[];
	};
	hasShadowSide: boolean;
	chasmTileAdd: number;
}

type GfxBaseMap = { [key in GFX_TYPE]: number[][]; } & {
	offset?: Point
};

export type GfxMap = GfxBaseMap & {
	wallYVariance?: {
		[key in GFX_TYPE]: {
			loop: number[];
			end: number[];
			start?: number[]
		}
	}
};

export type GfxMapChasm = GfxBaseMap & {
	wallYVariance?: {
		[key in GFX_TYPE]: {
			start: number[];
		}
	}
};

export const GFX_MAPS: { [key: string]: GfxMaps } = {};

let map: GfxMaps = {
	BASE: <any>{},
	ALT: <any>{},
	SHADOW: <any>{},
	CHASM: <any>{},
	DARK_WALL: <any>{},
	CHASM_FLOOR: <any>{},
	BACK_WALL: <any>{},
	
	SUB: {
		BASE: <any>{},
		SHADOW: <any>{},
		BACK_WALL: <any>{},
		BORDER: <any>{}
	},
	
	hasShadowSide: true,
	chasmTileAdd: 1
};
GFX_MAPS['TYPE1'] = map;

map['BASE'][GFX_TYPE.NORTH] = [[2, 0], [3, 0]];
map['BASE'][GFX_TYPE.EAST] = [[3, 1], [3, 2]];
map['BASE'][GFX_TYPE.SOUTH] = [[2, 3], [3, 3]];
map['BASE'][GFX_TYPE.WEST] = [[2, 1], [2, 2]];
map['BASE'][GFX_TYPE.DIAGONAL_NE] = [[4, 0], [5, 1]];
map['BASE'][GFX_TYPE.DIAGONAL_SE] = [[4, 3], [5, 2]];
map['BASE'][GFX_TYPE.DIAGONAL_SW] = [[0, 2], [1, 3]];
map['BASE'][GFX_TYPE.DIAGONAL_NW] = [[0, 1], [1, 0]];
map['BASE'][GFX_TYPE.CORNER_NE] = [[4, 1]];
map['BASE'][GFX_TYPE.CORNER_SE] = [[4, 2]];
map['BASE'][GFX_TYPE.CORNER_SW] = [[1, 2]];
map['BASE'][GFX_TYPE.CORNER_NW] = [[1, 1]];
map['BASE'][GFX_TYPE.WALL_SOUTH] = [[3, 4], [2, 4]];
map['BASE'][GFX_TYPE.WALL_SE] = [[5, 3], [4, 4]];
map['BASE'][GFX_TYPE.WALL_SW] = [[1, 4], [0, 3]];
map['BASE'][GFX_TYPE.WALL_SOUTH_BASE] = [[2, 5], [3, 5]];
map['BASE'][GFX_TYPE.WALL_SE_BASE] = [[4, 5], [5, 4]];
map['BASE'][GFX_TYPE.WALL_SW_BASE] = [[0, 4], [1, 5]];
map['BASE'][GFX_TYPE.WALL_END_WEST] = [[0, 6], [0, 7]];
map['BASE'][GFX_TYPE.WALL_END_WEST_BASE] = [[0, 6], [0, 7]];
map['BASE'][GFX_TYPE.WALL_END_EAST] = [[5, 6], [5, 7]];
map['BASE'][GFX_TYPE.WALL_END_EAST_BASE] = [[5, 6], [5, 7]];

map['ALT'].offset = {x: 0, y: 6};
map['ALT'][GFX_TYPE.WALL_SOUTH] = [[3, 0], [2, 0]];
map['ALT'][GFX_TYPE.WALL_SE] = [[5, 0], [4, 0]];
map['ALT'][GFX_TYPE.WALL_SW] = [[1, 0], [0, 0]];

map['SHADOW'].offset = {x: 0, y: 0};
map['SHADOW'][GFX_TYPE.FILL] = [[0, 0]];
map['SHADOW'][GFX_TYPE.INVISIBLE_WALL] = [[5, 0]];

map['CHASM'].offset = {x: 0, y: 1};
map['CHASM'].wallYVariance = <any>{};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SOUTH] = {start: [1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SE] = {start: [1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SW] = {start: [1, 0]};


map['DARK_WALL'].offset = {x: 0, y: 7};

map['BACK_WALL'].offset = {x: 0, y: 7};
map['BACK_WALL'][GFX_TYPE.EAST] = [[3, 3], [4, 2]];
map['BACK_WALL'][GFX_TYPE.WEST] = [[1, 2], [2, 3]];

map['SUB'].ignoreTerrain = [GFX_TYPE.WALL_SOUTH, GFX_TYPE.WALL_SE, GFX_TYPE.WALL_SW];
map['SUB']['BASE'][GFX_TYPE.WALL_SOUTH_BASE] = [[2, 4], [3, 4]];
map['SUB']['BASE'][GFX_TYPE.WALL_SE_BASE] = [[4, 4], [5, 3]];
map['SUB']['BASE'][GFX_TYPE.WALL_SW_BASE] = [[0, 3], [1, 4]];

map['SUB']['SHADOW'].offset = {x: 0, y: 5};
map['SUB']['SHADOW'][GFX_TYPE.NORTH] = [[2, 0], [3, 0]];
map['SUB']['SHADOW'][GFX_TYPE.DIAGONAL_NW] = [[0, 0], [1, 0]];
map['SUB']['SHADOW'][GFX_TYPE.DIAGONAL_NE] = [[4, 0], [5, 0]];
map['SUB']['SHADOW'][GFX_TYPE.WEST] = [[0, 1], [1, 1]];
map['SUB']['SHADOW'][GFX_TYPE.EAST] = [[5, 1], [4, 1]];

map['SUB']['BACK_WALL'].offset = {x: 0, y: 7};
map['SUB']['BACK_WALL'][GFX_TYPE.NORTH] = [[2, 0], [3, 0]];
map['SUB']['BACK_WALL'][GFX_TYPE.DIAGONAL_NW] = [[0, 0], [1, 0]];
map['SUB']['BACK_WALL'][GFX_TYPE.DIAGONAL_NE] = [[4, 0], [5, 0]];
map['SUB']['BACK_WALL'][GFX_TYPE.WEST] = [[0, 1], [1, 1]];
map['SUB']['BACK_WALL'][GFX_TYPE.EAST] = [[5, 1], [4, 1]];

map['SUB']['BORDER'][GFX_TYPE.NORTH] = [[[2, 5]], [[3, 5]]];
map['SUB']['BORDER'][GFX_TYPE.EAST] = [[[4, 5]], [[4, 6]]];
map['SUB']['BORDER'][GFX_TYPE.SOUTH] = [[[2, 6]], [[3, 6]]];
map['SUB']['BORDER'][GFX_TYPE.WEST] = [[[1, 5]], [[1, 6]]];

map = {
	BASE: <any>{},
	ALT: <any>{},
	SHADOW: <any>{},
	CHASM: <any>{},
	DARK_WALL: <any>{},
	CHASM_FLOOR: <any>{},
	BACK_WALL: <any>{},
	
	SUB: {
		BASE: <any>{},
		SHADOW: <any>{},
		BACK_WALL: <any>{},
		BORDER: <any>{}
	},
	
	hasShadowSide: false,
	chasmTileAdd: 0
};
GFX_MAPS['TYPE2'] = map;

map['BASE'][GFX_TYPE.NORTH] = [[1, 0]];
map['BASE'][GFX_TYPE.EAST] = [[4, 1]];
map['BASE'][GFX_TYPE.SOUTH] = [[1, 3]];
map['BASE'][GFX_TYPE.WEST] = [[3, 1]];
map['BASE'][GFX_TYPE.DIAGONAL_NE] = [[2, 0]];
map['BASE'][GFX_TYPE.DIAGONAL_SE] = [[2, 3]];
map['BASE'][GFX_TYPE.DIAGONAL_SW] = [[0, 3]];
map['BASE'][GFX_TYPE.DIAGONAL_NW] = [[0, 0]];
map['BASE'][GFX_TYPE.SQUARE_NE] = [[4, 0]];
map['BASE'][GFX_TYPE.SQUARE_SE] = [[4, 2]];
map['BASE'][GFX_TYPE.SQUARE_SW] = [[3, 2]];
map['BASE'][GFX_TYPE.SQUARE_NW] = [[3, 0]];
map['BASE'][GFX_TYPE.CORNER_NE] = [[2, 1]];
map['BASE'][GFX_TYPE.CORNER_SE] = [[2, 2]];
map['BASE'][GFX_TYPE.CORNER_SW] = [[0, 2]];
map['BASE'][GFX_TYPE.CORNER_NW] = [[0, 1]];

map['BASE'][GFX_TYPE.WALL_SOUTH] = [[1, 4]];
map['BASE'][GFX_TYPE.WALL_SOUTH_BASE] = [[1, 7]];
map['BASE'][GFX_TYPE.WALL_SE] = [[2, 4]];
map['BASE'][GFX_TYPE.WALL_SE_BASE] = [[2, 7]];
map['BASE'][GFX_TYPE.WALL_SW] = [[0, 4]];
map['BASE'][GFX_TYPE.WALL_SW_BASE] = [[0, 7]];
map['BASE'][GFX_TYPE.WALL_SQR_SE] = [[4, 3]];
map['BASE'][GFX_TYPE.WALL_SQR_SE_BASE] = [[4, 6]];
map['BASE'][GFX_TYPE.WALL_SQR_SW] = [[3, 3]];
map['BASE'][GFX_TYPE.WALL_SQR_SW_BASE] = [[3, 6]];
map['BASE'][GFX_TYPE.WALL_END_WEST] = [[3, 0]];
map['BASE'][GFX_TYPE.WALL_END_WEST_BASE] = [[3, 1]];
map['BASE'][GFX_TYPE.WALL_END_EAST] = [[4, 0]];
map['BASE'][GFX_TYPE.WALL_END_EAST_BASE] = [[4, 1]];
map['BASE'].wallYVariance = <any>{};
map['BASE'].wallYVariance![GFX_TYPE.WALL_SOUTH] = {loop: [1, 2], end: [0]};
map['BASE'].wallYVariance![GFX_TYPE.WALL_SE] = {loop: [1, 2], end: [0]};
map['BASE'].wallYVariance![GFX_TYPE.WALL_SW] = {loop: [1, 2], end: [0]};
map['BASE'].wallYVariance![GFX_TYPE.WALL_SQR_SE] = {loop: [1, 2], end: [0]};
map['BASE'].wallYVariance![GFX_TYPE.WALL_SQR_SW] = {loop: [1, 2], end: [0]};

map['SHADOW'].offset = {x: 0, y: 0};
map['SHADOW'][GFX_TYPE.FILL] = [[1, 1]];
map['SHADOW'][GFX_TYPE.INVISIBLE_WALL] = [[1, 2]];
map['SHADOW'][GFX_TYPE.EAST] = [[1, 1]];
map['SHADOW'][GFX_TYPE.WEST] = [[1, 1]];
map['SHADOW'].wallYVariance = <any>{};

map['CHASM'].offset = {x: 0, y: 8};
map['CHASM'][GFX_TYPE.WALL_SE_BASE] = [[3, 2]];
map['CHASM'][GFX_TYPE.WALL_SW_BASE] = [[4, 2]];
map['CHASM'][GFX_TYPE.WALL_SOUTH] = [[1, 2]];
map['CHASM'][GFX_TYPE.WALL_SQR_SW] = [[0, 2]];
map['CHASM'][GFX_TYPE.WALL_SQR_SE] = [[2, 2]];
map['CHASM'][GFX_TYPE.WALL_SE] = [[3, 3]];
map['CHASM'][GFX_TYPE.WALL_SW] = [[4, 3]];
map['CHASM'].wallYVariance = <any>{};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SOUTH] = {start: [2, 1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SE] = {start: [2, 1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SW] = {start: [2, 1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SQR_SE] = {start: [2, 1, 0]};
map['CHASM'].wallYVariance![GFX_TYPE.WALL_SQR_SW] = {start: [2, 1, 0]};


map['CHASM_FLOOR'].offset = {x: 0, y: 8};
map['CHASM_FLOOR'][GFX_TYPE.DIAGONAL_SE] = [[3, 0]];
map['CHASM_FLOOR'][GFX_TYPE.DIAGONAL_SW] = [[4, 0]];
map['CHASM_FLOOR'][GFX_TYPE.WALL_SOUTH] = [[1, 1]];
map['CHASM_FLOOR'][GFX_TYPE.WALL_SQR_SW] = [[0, 1]];
map['CHASM_FLOOR'][GFX_TYPE.WALL_SQR_SE] = [[2, 1]];
map['CHASM_FLOOR'][GFX_TYPE.WALL_SE] = [[3, 1]];
map['CHASM_FLOOR'][GFX_TYPE.WALL_SW] = [[4, 1]];
map['CHASM_FLOOR'].wallYVariance = <any>{};
map['CHASM_FLOOR'].wallYVariance![GFX_TYPE.WALL_SOUTH] = {start: [3, 2, 0]};
map['CHASM_FLOOR'].wallYVariance![GFX_TYPE.WALL_SE] = {start: [4, 3, 0]};
map['CHASM_FLOOR'].wallYVariance![GFX_TYPE.WALL_SW] = {start: [4, 3, 0]};
map['CHASM_FLOOR'].wallYVariance![GFX_TYPE.WALL_SQR_SE] = {start: [3, 2, 0]};
map['CHASM_FLOOR'].wallYVariance![GFX_TYPE.WALL_SQR_SW] = {start: [3, 2, 0]};


map['DARK_WALL'].offset = {x: 0, y: 13};
map['DARK_WALL'][GFX_TYPE.NORTH] = [[3, 1]];
map['DARK_WALL'][GFX_TYPE.DIAGONAL_NE] = [[1, 0]];
map['DARK_WALL'][GFX_TYPE.DIAGONAL_NW] = [[0, 0]];
map['DARK_WALL'][GFX_TYPE.SQUARE_NW] = [[2, 1]];
map['DARK_WALL'][GFX_TYPE.SQUARE_NE] = [[4, 1]];
map['DARK_WALL'][GFX_TYPE.DIAGONAL_NW] = [[0, 0]];
map['DARK_WALL'][GFX_TYPE.CORNER_NE] = [[2, 0]];
map['DARK_WALL'][GFX_TYPE.CORNER_NW] = [[2, 0]];
map['DARK_WALL'][GFX_TYPE.WEST] = [[0, 1]];
map['DARK_WALL'][GFX_TYPE.EAST] = [[1, 1]];


map['BACK_WALL'].offset = {x: 0, y: 2};
map['BACK_WALL'][GFX_TYPE.WALL_SOUTH_BASE] = [[1, 6]];
map['BACK_WALL'][GFX_TYPE.WALL_SE_BASE] = [[2, 6]];
map['BACK_WALL'][GFX_TYPE.WALL_SW_BASE] = [[0, 6]];
map['BACK_WALL'][GFX_TYPE.WALL_SQR_SE_BASE] = [[4, 5]];
map['BACK_WALL'][GFX_TYPE.WALL_SQR_SW_BASE] = [[3, 5]];
map['BACK_WALL'][GFX_TYPE.EAST] = [[1, 0]];
map['BACK_WALL'][GFX_TYPE.WEST] = [[1, 0]];
map['BACK_WALL'].wallYVariance = <any>{};
map['BACK_WALL'].wallYVariance![GFX_TYPE.WALL_SOUTH] = {loop: [1], end: [0]};
map['BACK_WALL'].wallYVariance![GFX_TYPE.WALL_SE] = {loop: [1], end: [0]};
map['BACK_WALL'].wallYVariance![GFX_TYPE.WALL_SW] = {loop: [1], end: [0]};
map['BACK_WALL'].wallYVariance![GFX_TYPE.WALL_SQR_SE] = {loop: [1], end: [0]};
map['BACK_WALL'].wallYVariance![GFX_TYPE.WALL_SQR_SW] = {loop: [1], end: [0]};

map['SUB'].ignoreTerrain = [GFX_TYPE.WALL_SOUTH, GFX_TYPE.WALL_SOUTH_BASE, GFX_TYPE.WALL_SE, GFX_TYPE.WALL_SW, GFX_TYPE.WALL_SQR_SE, GFX_TYPE.WALL_SQR_SE_BASE, GFX_TYPE.WALL_SQR_SW, GFX_TYPE.WALL_SQR_SW_BASE];
map['SUB'].ignoreTerrainKeepWallBase = [GFX_TYPE.WALL_SOUTH, GFX_TYPE.WALL_SE, GFX_TYPE.WALL_SW, GFX_TYPE.WALL_SQR_SE, GFX_TYPE.WALL_SQR_SW];
map['SUB']['BASE'][GFX_TYPE.WALL_SE_BASE] = [[2, 4]];
map['SUB']['BASE'][GFX_TYPE.WALL_SW_BASE] = [[0, 4]];
map['SUB']['BASE'][GFX_TYPE.WALL_SOUTH_BASE] = [[1, 4]];
map['SUB']['BASE'][GFX_TYPE.WALL_SQR_SE_BASE] = [[1, 2]];
map['SUB']['BASE'][GFX_TYPE.WALL_SQR_SW_BASE] = [[1, 1]];

map['SUB']['SHADOW'].offset = {x: 0, y: 0};
map['SUB']['SHADOW'][GFX_TYPE.DIAGONAL_NW] = [[3, 3]];
map['SUB']['SHADOW'][GFX_TYPE.DIAGONAL_NE] = [[4, 3]];

map['SUB']['BACK_WALL'].offset = {x: 0, y: 0};
map['SUB']['BACK_WALL'][GFX_TYPE.DIAGONAL_SE] = [[3, 4]];
map['SUB']['BACK_WALL'][GFX_TYPE.DIAGONAL_SW] = [[4, 4]];

map['SUB']['BORDER'][GFX_TYPE.NORTH] = [[[2, 5]], [[3, 5]]];
map['SUB']['BORDER'][GFX_TYPE.EAST] = [[[4, 5]], [[4, 6]]];
map['SUB']['BORDER'][GFX_TYPE.SOUTH] = [[[2, 6]], [[3, 6]]];
map['SUB']['BORDER'][GFX_TYPE.WEST] = [[[1, 5]], [[1, 6]]];

map['SUB']['CHASM_FLOOR'] = <any>{};
map['SUB']['CHASM_FLOOR']![GFX_TYPE.DIAGONAL_SE] = [[0, 5]];
map['SUB']['CHASM_FLOOR']![GFX_TYPE.DIAGONAL_SW] = [[0, 6]];


export const BASE_GFX = [GFX_TYPE.WALL_SOUTH_BASE, GFX_TYPE.WALL_SE_BASE, GFX_TYPE.WALL_SW_BASE];

export const BACK_WALL_MAP: { [key in GFX_TYPE]: GFX_TYPE } = <any>{};
BACK_WALL_MAP[GFX_TYPE.WEST] = GFX_TYPE.WEST;
BACK_WALL_MAP[GFX_TYPE.EAST] = GFX_TYPE.EAST;
BACK_WALL_MAP[GFX_TYPE.DIAGONAL_NW] = GFX_TYPE.DIAGONAL_SE;
BACK_WALL_MAP[GFX_TYPE.DIAGONAL_NE] = GFX_TYPE.DIAGONAL_SW;

export const SHADOW_GROUND = [GFX_TYPE.DIAGONAL_NE, GFX_TYPE.DIAGONAL_NW, GFX_TYPE.NORTH, GFX_TYPE.EAST, GFX_TYPE.WEST, GFX_TYPE.CORNER_NE, GFX_TYPE.CORNER_NW];

export const BLOCK_MAP: { [key in FILL_TYPE]: number } = <any>{};
BLOCK_MAP[FILL_TYPE.SQUARE] = 2;
BLOCK_MAP[FILL_TYPE.NORTHEAST] = 8;
BLOCK_MAP[FILL_TYPE.SOUTHEAST] = 9;
BLOCK_MAP[FILL_TYPE.SOUTHWEST] = 10;
BLOCK_MAP[FILL_TYPE.NORTHWEST] = 11;

export const HOLE_MAP: { [key in FILL_TYPE]: number } = <any>{};
HOLE_MAP[FILL_TYPE.SQUARE] = 1;
HOLE_MAP[FILL_TYPE.NORTHEAST] = 6;
HOLE_MAP[FILL_TYPE.SOUTHEAST] = 7;
HOLE_MAP[FILL_TYPE.SOUTHWEST] = 4;
HOLE_MAP[FILL_TYPE.NORTHWEST] = 5;

export const HOLE_BLOCK_MAP: { [key in FILL_TYPE]: number } = <any>{};
HOLE_BLOCK_MAP[FILL_TYPE.SQUARE] = 2;
HOLE_BLOCK_MAP[FILL_TYPE.NORTHEAST] = 24;
HOLE_BLOCK_MAP[FILL_TYPE.SOUTHEAST] = 25;
HOLE_BLOCK_MAP[FILL_TYPE.SOUTHWEST] = 26;
HOLE_BLOCK_MAP[FILL_TYPE.NORTHWEST] = 27;
