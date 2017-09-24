import {Attributes, CrossCodeMap, MapLayer, Point} from '../../interfaces/cross-code-map';
import {CCMapLayer} from './cc-map-layer';
import {Globals} from '../../globals';
import {EntityManager} from '../entities/entity-manager';

export class CCMap {
	name: string;
	levels: { height: number }[];
	mapWidth: number;
	mapHeight: number;
	masterLevel: number;
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

		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());

		this.layers = [];

		// load needed assets for sprite props
		console.log(map.entities.length);

		map.layer.forEach(layer => {
			game.load.image(layer.tilesetName, Globals.URL + layer.tilesetName, false);
		});

		return new Promise((resolve, reject) => {
			game.load.onLoadComplete.addOnce(() => {

				// generate Map Layers
				if (this.inputLayers) {
					this.inputLayers.forEach(layer => {
						if (!layer.tilesetName) {
							return;
						}
						const ccLayer = new CCMapLayer(game, layer);
						this.layers.push(ccLayer);
					});

					this.inputLayers = null;
				}

				// generate Map Entities
				game.plugins.plugins.forEach(plugin => {
					if (plugin instanceof EntityManager) {
						(<EntityManager>plugin).initialize(this, map);
					}
				});

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
	}

	exportMap(): CrossCodeMap {
		const out: CrossCodeMap = <any>{};

		this.props.forEach(prop => out[prop] = this[prop]);
		this.game.plugins.plugins.forEach(plugin => {
			if (plugin instanceof EntityManager) {
				out.entities = (<EntityManager>plugin).exportEntities();
			}
		});
		out.layer = [];
		this.layers.forEach(l => out.layer.push(l.details));

		return out;
	}
}
