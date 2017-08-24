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

	filename: string;

	private props = [
		'name',
		'levels',
		'mapWidth',
		'mapHeight',
		'masterLevel',
		'attributes',
		'screen',
	];

	private inputLayers: MapLayer[];

	constructor(private game: Phaser.Game) {
	}

	loadMap(map: CrossCodeMap): Promise<CCMap> {

		const game = this.game;

		this.props.forEach(prop => this[prop] = map[prop]);
		this.filename = map.filename;

		this.inputLayers = map.layer;

		// ignore entities for now
		this.entities = map.entities;

		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());

		this.layers = [];

		map.layer.forEach(layer => {
			game.load.image(layer.tilesetName, 'http://localhost:8080/' + layer.tilesetName);
		});

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
			game.load.crossOrigin = 'anonymous';
			game.load.start();
		});

	}

	resize(width: number, height: number) {
		this.mapWidth = width;
		this.mapHeight = height;

		this.layers.forEach(layer => {
			layer.resize(width, height);
		});

		console.log(this);
	}

	export(): CrossCodeMap {
		const out: CrossCodeMap = <any>{};

		this.props.forEach(prop => out[prop] = this[prop]);
		out.entities = this.entities;
		out.layer = [];
		this.layers.forEach(l => out.layer.push(l.details));

		return out;
	}
}
