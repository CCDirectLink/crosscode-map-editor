import {Point} from '../../models/cross-code-map';

export enum AutotileType {
	/** 8x2 */
	DEFAULT = 8,
	
	/** 10x2 */
	EXTENDED = 10
}

export interface AutotileConfig {
	tileCountX: number;
	type: AutotileType;
	base: Point;
	cliff: Point;
	key: string;
}

export const AUTOTILE_CONFIG: {
	[key: string]: AutotileConfig[] | undefined
} = {};

// key gets auto generated
AUTOTILE_CONFIG['media/map/bergen-trail.png'] = [{
	key: '',
	tileCountX: 32,
	type: AutotileType.EXTENDED,
	base: {x: 1, y: 0},
	cliff: {x: 6, y: 4}
}, {
	key: '',
	tileCountX: 32,
	type: AutotileType.DEFAULT,
	base: {x: 1, y: 2},
	cliff: {x: 12, y: 4}
}];


for (const key of Object.keys(AUTOTILE_CONFIG)) {
	AUTOTILE_CONFIG[key]!.forEach(config => config.key = key);
}
