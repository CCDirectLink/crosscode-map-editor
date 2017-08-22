import {Attributes, CrossCodeMap, MapEntity, MapLayer, Point} from '../../interfaces/cross-code-map';
import {CCMapLayer} from './cc-map-layer';

export class CCMap {
	name: string;
	levels: { height: number }[];
	mapWidth: number;
	mapHeight: number;
	masterLevel: number;
	entities: MapEntity[] = [];
	layers: CCMapLayer[] = [];
	attributes: Attributes;
	screen: Point;

	private inputLayers: MapLayer[];

	constructor(private game: Phaser.Game) {
	}

	loadMap(map: CrossCodeMap): Promise<CCMap> {

		const game = this.game;

		this.name = map.name;
		this.levels = map.levels;
		this.mapWidth = map.mapWidth;
		this.mapHeight = map.mapHeight;
		this.masterLevel = map.masterLevel;
		this.attributes = map.attributes;
		this.screen = map.screen;

		this.inputLayers = map.layer;

		// ignore entities for now
		// this.entities = map.entities;

		this.layers.forEach(layer => {
			// layer.destroy();
		});
		this.layers = [];

		map.layer.forEach(layer => {
			game.load.image(layer.tilesetName, 'http://localhost:8080/' + layer.tilesetName);
		});
		game.load.start();

		return new Promise((resolve, reject) => {
			game.load.onLoadComplete.addOnce(() => {
				if (!this.inputLayers) {
					return;
				}

				this.inputLayers.forEach(layer => {
					const ccLayer = new CCMapLayer(game, layer);
					this.layers.push(ccLayer);
				});

				this.inputLayers = null;

				resolve(this);
			});
		});
	}
}
