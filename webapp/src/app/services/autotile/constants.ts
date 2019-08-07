import {Point} from '../../models/cross-code-map';
import {AutotileType} from './autotile-config';

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

export const AUTOTILE_FILL_TYPE: {
	[key in AutotileType]: FillType
} = <any>{};

AUTOTILE_FILL_TYPE[AutotileType.DEFAULT] = fillTypeDefault;
AUTOTILE_FILL_TYPE[AutotileType.EXTENDED] = fillTypeExtended;

