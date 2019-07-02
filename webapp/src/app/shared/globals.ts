import {CCMap} from './phaser/tilemap/cc-map';
import {StateHistoryService} from './history/state-history.service';
import {MapLoaderService} from './map-loader.service';
import {GlobalEventsService} from './global-events.service';
import {PhaserEventsService} from './phaser/phaser-events.service';

export class Globals {
	static isElectron = false;
	static game: Phaser.Game;
	static scene: Phaser.Scene;
	static map: CCMap;
	static TILE_SIZE = 16;
	static URL = 'http://localhost:8080/';
	static entitySettings = {
		gridSize: 8,
		enableGrid: false
	};
	static disablePhaserInput = false;
	static zIndexUpdate = false;
	
	// TODO: remove them from global state
	static stateHistoryService: StateHistoryService;
	static mapLoaderService: MapLoaderService;
	static globalEventsService: GlobalEventsService;
	static phaserEventsService: PhaserEventsService;
}
