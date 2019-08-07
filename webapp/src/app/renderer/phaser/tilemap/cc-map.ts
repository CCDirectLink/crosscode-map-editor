import {Attributes, CrossCodeMap, MapLayer, Point} from '../../../models/cross-code-map';
import {CCMapLayer} from './cc-map-layer';
import {EntityManager} from '../entities/entity-manager';
import {Subscription} from 'rxjs';
import { SettingsService } from '../../../services/settings.service';
import { StateHistoryService } from '../../../history/state-history.service';
import { LoaderService } from '../../../services/loader.service';
import { EventService } from '../../../services/event.service';

export class CCMap {
	public readonly data!: CrossCodeMap;

	layers: CCMapLayer[] = [];
	
	private tileMap?: Phaser.Tilemaps.Tilemap;
	
	private historySub: Subscription;
	private offsetSub: Subscription;
	
	filename = '';
	
	private inputLayers?: MapLayer[];
	
	constructor(
		private game: Phaser.Game,
		private scene: Phaser.Scene,
		private entityManager: EntityManager,
		private settings: SettingsService,
		private loader: LoaderService,
		private events: EventService,
		private stateHistory: StateHistoryService,
	) {
		this.historySub = stateHistory.selectedState.subscribe(container => {
			if (!container || !container.state) {
				return;
			}
			const selectedLayer = this.loader.selectedLayer;
			const i = this.layers.indexOf(<any>selectedLayer.getValue());
			this.loadMap(JSON.parse(container.state.json), true);
			if (i >= 0 && this.layers.length > i) {
				selectedLayer.next(this.layers[i]);
			}
		});
		
		// TODO: move out of tilemap
		// const undoKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		// game.input.keyboard.removeKeyCapture(undoKey.keyCode);
		// this.keyBinding = undoKey.onDown.add(() => {
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	if (game.input.keyboard.isDown(Phaser.KeyCode.CONTROL)) {
		// 		if (game.input.keyboard.isDown(Phaser.KeyCode.SHIFT)) {
		// 			stateHistory.redo();
		// 		} else {
		// 			stateHistory.undo();
		// 		}
		// 	}
		//
		// });
		this.offsetSub = events.offsetMap.subscribe(offset => this.offsetMap(offset));
	}
	
	destroy() {
		this.historySub.unsubscribe();
		this.offsetSub.unsubscribe();
	}
	
	loadMap(map: CrossCodeMap, skipInit = false) {
		const game = this.game;
		const tileMap = this.scene.make.tilemap({
			width: map.mapWidth,
			height: map.mapHeight,
			tileHeight: this.settings.TILE_SIZE,
			tileWidth: this.settings.TILE_SIZE
		});
		
		this.tileMap = tileMap;
		
		this.filename = map.filename;
		
		this.inputLayers = map.layer;
		
		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());
		
		this.layers = [];
		
		// generate Map Layers
		if (this.inputLayers) {
			this.inputLayers.forEach(layer => {
				const ccLayer = new CCMapLayer(this.scene, tileMap, layer);
				this.layers.push(ccLayer);
			});
			
			this.inputLayers = undefined;
		}
		
		// generate entities
		this.entityManager.initialize(map);
		
		if (!skipInit) {
			this.stateHistory.init({
				name: 'load',
				icon: 'insert_drive_file',
				json: JSON.stringify(this.exportMap())
			});
		}
		
		this.loader.tileMap.next(this);
		this.loader.selectedLayer.next(this.layers[0]);
	}
	
	resize(width: number, height: number, skipRender = false) {
		this.data.mapWidth = width;
		this.data.mapHeight = height;
		
		this.layers.forEach(layer => layer.resize(width, height, skipRender));
		this.events.updateMapBorder.next(true);
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
	
	exportMap(): CrossCodeMap {
		const out: CrossCodeMap = this.data;
		
		out.entities = this.entityManager.exportEntities();
		out.layer = [];
		this.layers.forEach(l => out.layer.push(l.exportLayer()));
		
		return out;
	}
}
