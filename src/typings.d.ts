/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
	id: string;
}

declare module Phaser {
	export interface TilemapLayer {
		crossCode: {
			name: string;
			level: any;
			type: string;
			distance: number;
		};
	}
}
