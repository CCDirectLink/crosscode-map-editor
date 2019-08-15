import {Point} from '../../models/cross-code-map';

export enum AutotileType {
	/** 8x2 */
	DEFAULT = 8,
	
	/** 10x2 */
	LARGE = 10
}

export interface AutotileConfig {
	tileCountX: number;
	type: AutotileType;
	base: Point;
	cliff: Point;
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

const fillTypeExtended: FillType = JSON.parse(JSON.stringify(fillTypeDefault));
fillTypeExtended.OOXX.push({x: 8, y: 0});
fillTypeExtended.OXXO.push({x: 9, y: 0});
fillTypeExtended.XXOO.push({x: 8, y: 1});
fillTypeExtended.XOOX.push({x: 9, y: 1});

export const FILL_TYPE: {
	[key in AutotileType]: FillType
} = <any>{};

FILL_TYPE[AutotileType.DEFAULT] = fillTypeDefault;
FILL_TYPE[AutotileType.LARGE] = fillTypeExtended;

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
