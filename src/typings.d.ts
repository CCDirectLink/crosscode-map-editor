/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
	id: string;
}

declare module Phaser {
	export interface Tilemap {
		crossCode: {
			name: string;
			levels: { height: number }[];
			masterLevel: number;
			screen: { x: number, y: number };
			attributes: {
				saveMode: string;
				bgm: string;
				cameraInBounds: boolean;
				'map-sounds': string;
				mapStyle: any;
				weather: string;
				area: string;
				npcRunners: string;
			};
		};
	}

	export interface TilemapLayer {
		crossCode: {
			name: string;
			level: any;
			type: string;
			distance: number;
		};
	}
}
