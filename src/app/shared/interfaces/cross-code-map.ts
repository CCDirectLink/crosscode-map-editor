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
}

export interface Point {
	x: number;
	y: number;
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
	level: number | { level: number, offset: number };
	settings: any;
}

export interface MapLayer {
	id: number;
	type: string;
	name: string;
	level: number;
	width: number;
	height: number;
	visible: number;
	tilesetName: string;
	repeat: boolean;
	distance: number;
	tilesize: number;
	moveSpeed: Point;
	data: number[][];
}
