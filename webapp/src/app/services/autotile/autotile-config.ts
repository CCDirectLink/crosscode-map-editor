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
	start: Point;
}

export const AUTOTILE_CONFIG: {
	[key: string]: AutotileConfig[] | undefined
} = {};

AUTOTILE_CONFIG['media/map/bergen-trail.png'] = [{
	tileCountX: 32,
	type: AutotileType.EXTENDED,
	start: {x: 1, y: 0}
}];
