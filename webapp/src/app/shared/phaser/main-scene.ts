import * as Phaser from 'phaser';
import {EditorView} from '../../models/editor-view';
import {StateHistoryService} from '../history/state-history.service';
import {MapLoaderService} from '../map-loader.service';
import {PhaserEventsService} from './phaser-events.service';
import {GlobalEventsService} from '../global-events.service';
import {FileInfos} from '../../models/file-infos';
import {Globals} from '../globals';
import {CCMap} from './tilemap/cc-map';
import {Subscription} from 'rxjs';

export class MainScene extends Phaser.Scene {
	
	private tileMap: CCMap;
	private border: Phaser.GameObjects.Rectangle;
	private sub: Subscription;
	
	constructor(
		private res: FileInfos,
		private stateHistory: StateHistoryService,
		private mapLoader: MapLoaderService,
		private phaserEventsService: PhaserEventsService,
		private globalEvents: GlobalEventsService
	) {
		super({key: 'main'});
	}
	
	preload() {
		// res.data.forEach(json => {
		// 	this.game.load.json(json, Globals.URL + json);
		// });
		this.res.images.forEach(img => {
			this.load.image(img, Globals.URL + img);
		});
		
		this.load.json('definitions.json', 'assets/definitions.json');
		this.load.json('destructibles.json', 'assets/destructibles.json');
		this.load.crossOrigin = 'anonymous';
		
		this.load.maxParallelDownloads = this.res.images.length;
		this.load.once('complete', () => this.globalEvents.loadComplete.next());
	}
	
	create() {
		const game = this.game;
		
		this.game['StateHistoryService'] = this.stateHistory;
		this.game['MapLoaderService'] = this.mapLoader;
		this.game['PhaserEventsService'] = this.phaserEventsService;
		this.game['GlobalEventsService'] = this.globalEvents;
		
		
		this.cameras.main.setBackgroundColor('#616161');
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		game.scale.scaleMode = Phaser.Scale.ScaleModes.NONE;
		
		const scale = 1 / window.devicePixelRatio;
		
		this.tileMap = new CCMap(game, this);
		Globals.map = this.tileMap;
		this.sub = this.mapLoader.map.subscribe((map) => {
			if (map) {
				this.tileMap.loadMap(map);
				this.rescaleBorder();
			}
		});
		this.phaserEventsService.updateMapBorder.subscribe(a => this.rescaleBorder());
		
		// plugins
		// TODO: should be scenes instead of plugins
		// this.mapPan = game.plugins.add(MapPan);
		// this.entityManager = game.plugins.add(EntityManager);
		// this.entityManager.setGlobalEvents(this.globalEvents);
		
		// this.globalEvents.currentView.subscribe(view => {
		// 	if (view === EditorView.Layers) {
		// 		this.tileDrawer.activate();
		// 		this.tileDrawer.selectLayer(this.mapLoader.selectedLayer.getValue(), this.tileMap);
		// 		this.entityManager.deactivate();
		// 	} else if (view === EditorView.Entities) {
		// 		this.tileDrawer.selectLayer(null);
		// 		this.tileDrawer.deactivate();
		// 		this.entityManager.activate();
		// 	}
		// });
		
		this.add.circle(80, 80, 80, 0xff66ff);
		this.border = this.add.rectangle();
		// this.mapLoader.selectedLayer.subscribe(layer => this.tileDrawer.selectLayer(layer));
		this.globalEvents.currentView.next(EditorView.Layers);
		
		// TODO
		// this.heightGenerator.init(game);
	}
	
	destroy(){
		console.log('destroy scene');
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
	
	private rescaleBorder() {
		const s = Globals.TILE_SIZE * this.cameras.main.zoom;
		// this.border.setSize(this.tileMap.mapWidth * s, this.tileMap.mapHeight * s);
	}
}
