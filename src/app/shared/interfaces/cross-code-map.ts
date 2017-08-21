export interface CrossCodeMap {
	name: string;
	levels: { height: number }[];
	mapWidth: number;
	mapHeight: number;
	masterLevel: number;
	entities: MapEntity[];
	layer: MapLayer[];
	attributes: {
		saveMode: string;
		bgm: string;
		cameraInBounds: boolean;
		'map-sounds': string;
		mapStyle: string;
		weather: string;
		npcRunners: string;
		area: string;
	};
	screen: { x: number, y: number };
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
	level: string;
	width: number;
	height: number;
	visible: number;
	tilesetName: string;
	repeat: boolean;
	distance: string;
	tilesize: number;
	moveSpeed: { x: number, y: number };
	data: number[][];
}
