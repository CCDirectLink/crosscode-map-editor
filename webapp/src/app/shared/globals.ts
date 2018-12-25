import {CCMap} from './phaser/tilemap/cc-map';

export class Globals {
	static isElectron = false;
	static game: Phaser.Game;
	static map: CCMap;
	static TILE_SIZE = 16;
	static URL = 'http://localhost:8080/';
	static entitySettings = {
		gridSize: 8,
		enableGrid: false
	};
	static disablePhaserInput = false;
	static zIndexUpdate = false;
}
