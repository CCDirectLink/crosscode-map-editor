import {Point} from '../../models/cross-code-map';

/** value is width, height is always 2 */
export enum AutotileType {
	SMALL = 4,
	DEFAULT = 8,
	LARGE = 10,
	SUPER_LARGE = 12,
	MEGA_LARGE = 14
}

export interface AutotileConfig {
	tileCountX: number;
	type: AutotileType;
	base: Point;
	cliff?: Point;
	mergeWithEmpty: boolean;
	key: string;
}

/**
 * naming is clock wise: top left, top right, bottom right, bottom left.
 * X means tile, O means border.
 *
 * E.g. XXXX is the filled tile, OXXO is the left border
 */
export interface FillType {
	XXXX: Point[];
	OXXX: Point[];
	XOXX: Point[];
	OXOX: Point[];
	OOXX: Point[];
	OXXO: Point[];
	OOXO: Point[];
	OOOX: Point[];
	OOOO: Point[];
	XXXO: Point[];
	XXOX: Point[];
	XOXO: Point[];
	XXOO: Point[];
	XOOX: Point[];
	OXOO: Point[];
	XOOO: Point[];
}

export const FILL_TYPE: {
	[key in AutotileType]: FillType
} = <any>{};

const empty: FillType = {
	XXXX: [],
	OXXX: [],
	XOXX: [],
	OXOX: [],
	OOXX: [],
	OXXO: [],
	OOXO: [],
	OOOX: [],
	OOOO: [],
	XXXO: [],
	XXOX: [],
	XOXO: [],
	XXOO: [],
	XOOX: [],
	OXOO: [],
	XOOO: []
};


const fillTypeDefault: FillType = {
	XXXX: [{x: 0, y: 0}],
	OXXX: [{x: 1, y: 0}],
	XOXX: [{x: 2, y: 0}],
	OXOX: [{x: 3, y: 0}],
	OOXX: [{x: 4, y: 0}],
	OXXO: [{x: 5, y: 0}],
	OOXO: [{x: 6, y: 0}],
	OOOX: [{x: 7, y: 0}],
	OOOO: [{x: 0, y: 1}],
	XXXO: [{x: 1, y: 1}],
	XXOX: [{x: 2, y: 1}],
	XOXO: [{x: 3, y: 1}],
	XXOO: [{x: 4, y: 1}],
	XOOX: [{x: 5, y: 1}],
	OXOO: [{x: 6, y: 1}],
	XOOO: [{x: 7, y: 1}],
};
FILL_TYPE[AutotileType.DEFAULT] = fillTypeDefault;

const fillTypeLarge: FillType = JSON.parse(JSON.stringify(fillTypeDefault));
fillTypeLarge.OOXX.push({x: 8, y: 0});
fillTypeLarge.OXXO.push({x: 9, y: 0});
fillTypeLarge.XXOO.push({x: 8, y: 1});
fillTypeLarge.XOOX.push({x: 9, y: 1});
FILL_TYPE[AutotileType.LARGE] = fillTypeLarge;

const fillTypeSuperLarge: FillType = JSON.parse(JSON.stringify(fillTypeLarge));
fillTypeSuperLarge.OOXO.push({x: 10, y: 0});
fillTypeSuperLarge.OOOX.push({x: 11, y: 0});
fillTypeSuperLarge.OXOO.push({x: 10, y: 1});
fillTypeSuperLarge.XOOO.push({x: 11, y: 1});
FILL_TYPE[AutotileType.SUPER_LARGE] = fillTypeSuperLarge;

const fillTypeMegaLarge: FillType = JSON.parse(JSON.stringify(fillTypeSuperLarge));
fillTypeMegaLarge.OOXX.push({x: 12, y: 0});
fillTypeMegaLarge.OXXO.push({x: 13, y: 0});
fillTypeMegaLarge.XXOO.push({x: 12, y: 1});
fillTypeMegaLarge.XOOX.push({x: 13, y: 1});
FILL_TYPE[AutotileType.MEGA_LARGE] = fillTypeMegaLarge;

const fillTypeSmall: FillType = JSON.parse(JSON.stringify(empty));
for (const value of Object.values(fillTypeSmall) as Point[][]) {
	value.push({x: 0, y: 0});
	value.push({x: 0, y: 0});
	value.push({x: 0, y: 0});
	value.push({x: 1, y: 0});
	value.push({x: 2, y: 0});
	value.push({x: 3, y: 0});
}

FILL_TYPE[AutotileType.SMALL] = fillTypeSmall;


export const FILL_TYPE_CLIFF_BORDER: FillType = JSON.parse(JSON.stringify(empty));

FILL_TYPE_CLIFF_BORDER.XXXX = [
	{x: 1, y: 0},
	{x: 2, y: 0},
	{x: 3, y: 0},
	{x: 4, y: 0},
	
	{x: 0, y: 1},
	{x: 1, y: 1},
	{x: 2, y: 1},
	{x: 3, y: 1},
	{x: 4, y: 1},
	{x: 5, y: 1},
	
	{x: 0, y: 2},
	{x: 1, y: 2},
	{x: 2, y: 2},
	{x: 3, y: 2},
	{x: 4, y: 2},
	{x: 5, y: 2},
	
	{x: 0, y: 3},
	{x: 1, y: 3},
	{x: 2, y: 3},
	{x: 3, y: 3},
	{x: 4, y: 3},
	{x: 5, y: 3},
	
	{x: 1, y: 4},
	{x: 2, y: 4},
	{x: 3, y: 4},
	{x: 4, y: 4}
];
FILL_TYPE_CLIFF_BORDER.OOXX = [
	{x: 1, y: 5},
	{x: 4, y: 5}
];
FILL_TYPE_CLIFF_BORDER.OXXO = [
	{x: 2, y: 5},
	{x: 2, y: 6}
];
FILL_TYPE_CLIFF_BORDER.OOOO = [
	{x: 0, y: 0},
	{x: 5, y: 0},
	{x: 0, y: 4},
	{x: 5, y: 4},
	{x: 0, y: 5},
	{x: 5, y: 5},
	{x: 0, y: 6},
	{x: 5, y: 6}
];
FILL_TYPE_CLIFF_BORDER.XXOO = [
	{x: 1, y: 6},
	{x: 4, y: 6}
];
FILL_TYPE_CLIFF_BORDER.XOOX = [
	{x: 3, y: 5},
	{x: 3, y: 6}
];

export const FILL_TYPE_CLIFF: FillType = JSON.parse(JSON.stringify(empty));

FILL_TYPE_CLIFF.XXXX = [
	{x: 0, y: 3},
	{x: 1, y: 4},
	{x: 4, y: 4},
	{x: 5, y: 3},
];

export const FILL_TYPE_CLIFF_ALT: FillType = JSON.parse(JSON.stringify(empty));

FILL_TYPE_CLIFF_ALT.XXXX = [
	{x: 0, y: 0},
	{x: 1, y: 0},
	{x: 4, y: 0},
	{x: 5, y: 0},
];
