import { DetailSettings } from '../services/phaser/entities/cc-entity';

export interface CrossCodeMap {
	name: string;
	levels: { height: number }[];
	mapWidth: number;
	mapHeight: number;
	masterLevel: number;
	entities: MapEntity[];
	layer: MapLayer[];
	attributes: Attributes;
	screen: Point;

	filename?: string;
	path?: string;
}

export interface Point {
	x: number;
	y: number;
}

export interface Point3 extends Point {
	z: number;
}

export interface PartialPoint3 extends Point {
	z?: number;
}

export interface Attributes {
	saveMode: string;
	bgm: string;
	cameraInBounds: boolean;
	'map-sounds': string;
	mapStyle: string;
	weather: string;
	npcRunners: string;
	area: string;
}

export interface MapEntity {
	type: string;
	x: number;
	y: number;
	level: number | { level: number; offset: number };
	settings: Partial<DetailSettings>;
}

export interface MapLayer {
	id?: number;
	type: string;
	name: string;
	level: any;
	levelName?: string;
	width: number;
	height: number;
	visible: number;
	tilesetName: string;
	repeat: boolean;
	lighter?: boolean;
	distance: number;
	tilesize: number;
	moveSpeed: Point;
	data: number[][];
}
