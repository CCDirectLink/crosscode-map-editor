import { Subscription } from 'rxjs';
import { Attributes, CrossCodeMap, MapLayer, Point } from '../../../models/cross-code-map';
import { Globals } from '../../globals';
import { EntityManager } from '../entities/entity-manager';
import { CCMapLayer } from './cc-map-layer';

export class CCMap {
	name = '';
	levels: { height: number }[] = [];
	mapWidth = 0;
	mapHeight = 0;
	masterLevel = 0;
	layers: CCMapLayer[] = [];
	attributes: Attributes = <any>{};
	screen: Point = {x: 0, y: 0};
	
	private lastMapId = 1;
	private tileMap?: Phaser.Tilemaps.Tilemap;
	
	private historySub: Subscription;
	private offsetSub: Subscription;
	
	filename = '';
	path?: string;
	
	private inputLayers?: MapLayer[];
	
	constructor(
		private game: Phaser.Game,
		private scene: Phaser.Scene,
		public entityManager: EntityManager
	) {
		const stateHistory = Globals.stateHistoryService;
		this.historySub = stateHistory.selectedState.subscribe(async container => {
			if (!container || !container.state) {
				return;
			}
			
			const makeLayerKey = (layer: CCMapLayer) => {
				return `${layer.details.name}\n${layer.details.levelName}\n${layer.details.level}`;
			};
			
			const selectedLayer = Globals.mapLoaderService.selectedLayer;
			const oldLayers = this.layers.map(v => ({
				key: makeLayerKey(v),
				visible: v.visible,
				selected: v === selectedLayer.getValue()
			}));
			
			await this.loadMap(JSON.parse(container.state.json), true);
			
			for (const layer of this.layers) {
				const key = makeLayerKey(layer);
				const oldLayer = oldLayers.find(v => v.key === key);
				if (!oldLayer) {
					continue;
				}
				layer.visible = oldLayer.visible;
				if (oldLayer.selected) {
					selectedLayer.next(layer);
				}
			}
		});
		
		this.offsetSub = Globals.globalEventsService.offsetMap.subscribe(offset => this.offsetMap(offset));
	}
	
	destroy() {
		this.historySub.unsubscribe();
		this.offsetSub.unsubscribe();
	}
	
	async loadMap(map: CrossCodeMap, skipInit = false) {
		const tileMap = this.scene.make.tilemap({
			width: map.mapWidth,
			height: map.mapHeight,
			tileHeight: Globals.TILE_SIZE,
			tileWidth: Globals.TILE_SIZE
		});
		
		this.tileMap = tileMap;
		
		this.name = map.name;
		this.levels = map.levels;
		this.mapWidth = map.mapWidth;
		this.mapHeight = map.mapHeight;
		this.masterLevel = map.masterLevel;
		this.attributes = map.attributes;
		this.screen = map.screen;
		this.filename = map.filename || 'untitled';
		this.path = map.path;
		
		this.inputLayers = map.layer;
		
		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());
		
		this.layers = [];
		
		// generate Map Layers
		if (this.inputLayers) {
			for (const layer of this.inputLayers) {
				const ccLayer = new CCMapLayer(tileMap);
				await ccLayer.init(layer);
				this.layers.push(ccLayer);
			}
			
			this.inputLayers = undefined;
		}
		
		this.lastMapId = 1;
		for (const entity of map.entities) {
			const mapId = entity.settings.mapId ?? 0;
			if (mapId > this.lastMapId) {
				this.lastMapId = mapId;
			}
		}
		
		// generate entities
		await this.entityManager.initialize(map, this);
		
		if (!skipInit) {
			Globals.stateHistoryService.init({
				name: 'load',
				icon: 'insert_drive_file',
				json: JSON.stringify(this.exportMap())
			});
		}
		
		Globals.mapLoaderService.tileMap.next(this);
		Globals.mapLoaderService.selectedLayer.next(this.layers[0]);
	}
	
	resize(width: number, height: number) {
		this.mapWidth = width;
		this.mapHeight = height;
		
		this.layers.forEach(layer => {
			// only update layers with distance: 1, parallax should not be touched
			if (layer.details.distance === 1) {
				layer.resize(width, height);
			}
		});
	}
	
	offsetMap(offset: Point, borderTiles = false) {
		this.layers.forEach(layer => layer.offsetLayer(offset, borderTiles));
	}
	
	addLayer(layer: CCMapLayer) {
		this.layers.push(layer);
	}
	
	removeLayer(layer: CCMapLayer) {
		const index = this.layers.indexOf(layer);
		this.layers.splice(index, 1);
		layer.destroy();
	}
	
	public getTilemap() {
		return this.tileMap;
	}
	
	public getUniqueMapid() {
		return ++this.lastMapId;
	}
	
	exportMap(): CrossCodeMap {
		const out: CrossCodeMap = <any>{};
		
		for (const level of this.levels) {
			const number = Number(level.height);
			if (!Number.isNaN(number)) {
				level.height = number;
			}
		}
		
		out.name = this.name;
		out.levels = this.levels;
		out.mapWidth = this.mapWidth;
		out.mapHeight = this.mapHeight;
		out.masterLevel = this.masterLevel;
		out.attributes = this.attributes;
		out.screen = this.screen;
		
		out.path = this.path;
		out.filename = this.filename;
		
		out.entities = this.entityManager.exportEntities();
		out.layer = [];
		this.layers.forEach(l => out.layer.push(l.exportLayer()));
		
		return out;
	}
}
