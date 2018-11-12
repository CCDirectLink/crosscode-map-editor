import {Attributes, CrossCodeMap, MapLayer, Point} from '../../interfaces/cross-code-map';
import {CCMapLayer} from './cc-map-layer';
import {Globals} from '../../globals';
import {EntityManager} from '../entities/entity-manager';
import {Helper} from '../helper';
import {StateHistoryService} from '../../../history/state-history.service';
import {Subscription} from 'rxjs';
import {GlobalEventsService} from '../../global-events.service';
import {PhaserEventsService} from '../phaser-events.service';

export class CCMap {
	name: string;
	levels: { height: number }[];
	mapWidth: number;
	mapHeight: number;
	masterLevel: number;
	layers: CCMapLayer[] = [];
	attributes: Attributes;
	screen: Point;
	
	private historySub: Subscription;
	private offsetSub: Subscription;
	private keyBinding: Phaser.SignalBinding;
	
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
		const stateHistory: StateHistoryService = game['StateHistoryService'];
		this.historySub = stateHistory.selectedState.subscribe(container => {
			if (!container || !container.state) {
				return;
			}
			const i = this.layers.indexOf(this.game['MapLoaderService'].selectedLayer.getValue());
			this.loadMap(JSON.parse(container.state.state), true);
			if (i >= 0 && this.layers.length > i) {
				this.game['MapLoaderService'].selectedLayer.next(this.layers[i]);
			}
		});
		
		const undoKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		game.input.keyboard.removeKeyCapture(undoKey.keyCode);
		this.keyBinding = undoKey.onDown.add(() => {
			if (Helper.isInputFocused()) {
				return;
			}
			if (game.input.keyboard.isDown(Phaser.KeyCode.CONTROL)) {
				if (game.input.keyboard.isDown(Phaser.KeyCode.SHIFT)) {
					stateHistory.redo();
				} else {
					stateHistory.undo();
				}
			}
			
		});
		const globalEvents: GlobalEventsService = this.game['GlobalEventsService'];
		this.offsetSub = globalEvents.offsetMap.subscribe(offset => this.offsetMap(offset));
	}
	
	destroy() {
		this.historySub.unsubscribe();
		this.offsetSub.unsubscribe();
		this.keyBinding.detach();
	}
	
	loadMap(map: CrossCodeMap, skipInit = false) {
		const game = this.game;
		
		this.props.forEach(prop => this[prop] = map[prop]);
		this.filename = map.filename;
		
		this.inputLayers = map.layer;
		
		// cleanup everything before loading new map
		this.layers.forEach(layer => layer.destroy());
		
		this.layers = [];
		
		// load needed assets for sprite props
		console.log(map.entities.length);
		
		// generate Map Layers
		if (this.inputLayers) {
			this.inputLayers.forEach(layer => {
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
		
		if (!skipInit) {
			this.game['StateHistoryService'].init({
				name: 'load',
				icon: 'insert_drive_file',
				state: JSON.stringify(this.exportMap())
			});
		}
		
		this.game['MapLoaderService'].tileMap.next(this);
		this.game['MapLoaderService'].selectedLayer.next(this.layers[0]);
	}
	
	resize(width: number, height: number, skipRender = false) {
		this.mapWidth = width;
		this.mapHeight = height;
		
		this.layers.forEach(layer => layer.resize(width, height, skipRender));
		const events: PhaserEventsService = this.game['PhaserEventsService'];
		events.updateMapBorder.next(true);
	}
	
	offsetMap(offset: Point, borderTiles = false, skipRender = false) {
		this.layers.forEach(layer => layer.offsetLayer(offset, borderTiles, skipRender));
	}
	
	renderAll() {
		this.layers.forEach(layer => layer.renderAll());
	}
	
	addLayer(layer: CCMapLayer) {
		this.layers.push(layer);
		layer.renderAll();
	}
	
	removeLayer(layer: CCMapLayer) {
		const index = this.layers.indexOf(layer);
		this.layers.splice(index, 1);
		layer.destroy();
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
		this.layers.forEach(l => out.layer.push(l.exportLayer()));
		
		return out;
	}
}
