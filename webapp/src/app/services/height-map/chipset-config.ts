import {Point} from '../../models/cross-code-map';
import {GFX_TYPE} from './constants';

export interface ChipsetConfig {
	tileCountX: number;
	base: ChipsetBase;
	terrains?: ChipsetBase[];
	mappingType?: string;
}

export interface ChipsetBase {
	ground: Point;
	cliff: Point;
	mappingType?: string;
	blockedTypes?: GFX_TYPE[];
	cliffAlt?: Point;
	chasmOnly?: boolean;
	border?: boolean;
	shadow?: Point;
	baseTerrain?: number;
	overrideWallBase?: boolean;
}


export const CHIPSET_CONFIG: {
	[key: string]: ChipsetConfig
} = <any>{};

CHIPSET_CONFIG['media/map/autumn-outside.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 5},
		blockedTypes: [GFX_TYPE.CORNER_SW, GFX_TYPE.CORNER_SE]
	},
	terrains: [
		{
			ground: {x: 0, y: 1},
			cliff: {x: 0, y: 5},
			border: true
		}
	]
};

CHIPSET_CONFIG['media/map/old-hideout.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 5},
		blockedTypes: [GFX_TYPE.CORNER_SW, GFX_TYPE.CORNER_SE]
	}
	
};

CHIPSET_CONFIG['media/map/bergen-trail.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 4},
		cliffAlt: {x: 0, y: 10},
		blockedTypes: []
	},
	terrains: [
		{
			ground: {x: 1, y: 0},
			cliff: {x: 6, y: 4},
			border: true
		},
		{
			ground: {x: 1, y: 2},
			cliff: {x: 12, y: 4},
			border: true
		},
		{
			ground: {x: 12, y: 12},
			cliff: {x: 12, y: 8},
			border: true
		}
	]
};


CHIPSET_CONFIG['media/map/heat-area.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 4},
		cliffAlt: {x: 0, y: 10},
		shadow: {x: 6, y: 6},
		blockedTypes: [],
		chasmOnly: true
	},
	terrains: [
		{
			ground: {x: 11, y: 0},
			cliff: {x: 6, y: 4},
			border: true
		},
		{
			ground: {x: 1, y: 0},
			cliff: {x: 12, y: 4},
			border: true
		},
		{
			ground: {x: 12, y: 12},
			cliff: {x: 12, y: 8},
			border: true
		},
		{
			ground: {x: 1, y: 2},
			cliff: {x: 18, y: 4},
			border: true
		}
	]
};

CHIPSET_CONFIG['media/map/cave.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 4},
		cliffAlt: {x: 0, y: 10},
		shadow: {x: 6, y: 4}
	},
	terrains: [
		{
			ground: {x: 2, y: 0},
			cliff: {x: 12, y: 4},
			border: false,
			shadow: {x: 12, y: 9}
		},
		{
			ground: {x: 8, y: 0},
			cliff: {x: 12, y: 4},
			border: false,
			shadow: {x: 12, y: 9}
		}
	]
};

CHIPSET_CONFIG['media/map/cold-dng.png'] = {
	tileCountX: 32,
	mappingType: 'TYPE1',
	base: {
		mappingType: 'TYPE1',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 4},
		cliffAlt: {x: 0, y: 10},
		shadow: {x: 6, y: 4}
	},
	terrains: [
		{
			mappingType: 'TYPE2',
			ground: {x: 12, y: 0},
			cliff: {x: 12, y: 4},
			shadow: {x: 17, y: 4}
		},
		{
			baseTerrain: 1,
			ground: {x: 20, y: 0},
			cliff: {x: 22, y: 4}
		}
	]
};


CHIPSET_CONFIG['media/map/heat-dng.png'] = {
	tileCountX: 32,
	base: {
		mappingType: 'TYPE2',
		ground: {x: 0, y: 0},
		cliff: {x: 0, y: 4},
		shadow: {x: 5, y: 4}
	},
	terrains: [
		{
			ground: {x: 1, y: 0},
			cliff: {x: 10, y: 4},
			border: true
		},
		{
			ground: {x: 9, y: 0},
			cliff: {x: 15, y: 4},
			border: true
		},
		{
			ground: {x: 19, y: 2},
			cliff: {x: 20, y: 4},
			border: false
		},
		{
			ground: {x: 26, y: 7},
			cliff: {x: 25, y: 4},
			border: false,
			overrideWallBase: true
		}
	]
};
