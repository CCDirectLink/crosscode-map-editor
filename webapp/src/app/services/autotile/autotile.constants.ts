import { Point } from '../../models/cross-code-map';
import { Helper } from '../phaser/helper';

/** Known autotile sizes */
export type AutotileType = '4x4' | '8x2' | '10x2' | '12x2' | '14x2';

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
 *
 *       XX                       OX
 *       XX                       OX
 *
 *
 * 4x4 uses a different layout: top, right, bottom, left.
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


const fillType8x2: FillType = {
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

const fillType10x2 = Helper.copy(fillType8x2);
fillType10x2.OOXX.push({x: 8, y: 0});
fillType10x2.OXXO.push({x: 9, y: 0});
fillType10x2.XXOO.push({x: 8, y: 1});
fillType10x2.XOOX.push({x: 9, y: 1});

const fillType12x2 = Helper.copy(fillType10x2);
fillType12x2.OOXO.push({x: 10, y: 0});
fillType12x2.OOOX.push({x: 11, y: 0});
fillType12x2.OXOO.push({x: 10, y: 1});
fillType12x2.XOOO.push({x: 11, y: 1});

const fillType14x2 = Helper.copy(fillType12x2);
fillType14x2.OOXX.push({x: 12, y: 0});
fillType14x2.OXXO.push({x: 13, y: 0});
fillType14x2.XXOO.push({x: 12, y: 1});
fillType14x2.XOOX.push({x: 13, y: 1});

const fillType4x4: FillType = {
	// order is important for same offset. Last one is used for reverse mapping
	OOOO: [{x: 2, y: 2}],
	XXXX: [{x: 2, y: 2}],
	
	OXXX: [{x: 2, y: 1}],
	XOXX: [{x: 3, y: 2}],
	XXOX: [{x: 2, y: 3}],
	XXXO: [{x: 1, y: 2}],
	
	XXOO: [{x: 1, y: 3}],
	OXXO: [{x: 1, y: 1}],
	OOXX: [{x: 3, y: 1}],
	XOOX: [{x: 3, y: 3}],
	
	OXOX: [{x: 1, y: 0}],
	XOXO: [{x: 0, y: 2}],
	
	XOOO: [{x: 0, y: 3}],
	OXOO: [{x: 0, y: 0}],
	OOXO: [{x: 0, y: 1}],
	OOOX: [{x: 2, y: 0}],
};


export const FILL_TYPE: {
	[key in AutotileType]: FillType
} = {
	'4x4': fillType4x4,
	'8x2': fillType8x2,
	'10x2': fillType10x2,
	'12x2': fillType12x2,
	'14x2': fillType14x2
};


export const FILL_TYPE_CLIFF_BORDER = Helper.copy(empty);

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

export const FILL_TYPE_CLIFF: FillType = Helper.copy(empty);

FILL_TYPE_CLIFF.XXXX = [
	{x: 0, y: 3},
	{x: 1, y: 4},
	{x: 4, y: 4},
	{x: 5, y: 3},
];

export const FILL_TYPE_CLIFF_ALT: FillType = Helper.copy(empty);

FILL_TYPE_CLIFF_ALT.XXXX = [
	{x: 0, y: 0},
	{x: 1, y: 0},
	{x: 4, y: 0},
	{x: 5, y: 0},
];
