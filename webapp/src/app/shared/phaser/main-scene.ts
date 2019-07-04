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
import {MapPan} from './map-pan';
import {TileDrawer} from './tilemap/tile-drawer';
import {EntityManager} from './entities/entity-manager';

export class MainScene extends Phaser.Scene {
	
	private readonly borderSize = 1;
	
	private border?: Phaser.GameObjects.Rectangle;
	private sub?: Subscription;
	
	constructor(
		private res: FileInfos,
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
		this.load.once('complete', () => Globals.globalEventsService.loadComplete.next());
	}
	
	create() {
		const game = this.game;
		
		this.cameras.main.setBackgroundColor('#616161');
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		game.scale.scaleMode = Phaser.Scale.ScaleModes.NONE;
		
		const scale = 1 / window.devicePixelRatio;
		console.log('pixel device ratio', window.devicePixelRatio);
		const tileMap = new CCMap(game, this);
		Globals.map = tileMap;
		
		
		this.sub = Globals.mapLoaderService.map.subscribe((map) => {
			if (map) {
				tileMap.loadMap(map);
				this.rescaleBorder();
			}
		});
		// TODO is now in phaserevents
		// Globals.updateMapBorder.subscribe(a => this.rescaleBorder());
		
		const pan = new MapPan(this, 'mapPan');
		this.add.existing(pan);
		
		const tileDrawer = new TileDrawer(this);
		this.add.existing(tileDrawer);
		
		const entityManager = new EntityManager(this);
		this.add.existing(entityManager);
		
		Globals.globalEventsService.currentView.subscribe(view => {
			console.log('current view', view);
			switch (view) {
				case EditorView.Layers:
					tileDrawer.setActive(true);
					entityManager.setActive(false);
					break;
				case EditorView.Entities:
					tileDrawer.setActive(false);
					entityManager.setActive(true);
					break;
			}
		});
		
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
		
		// this.mapLoader.selectedLayer.subscribe(layer => this.tileDrawer.selectLayer(layer));
		Globals.globalEventsService.currentView.next(EditorView.Layers);
		
		// TODO
		// this.heightGenerator.init(game);
	}
	
	destroy() {
		console.log('destroy scene');
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
	
	private rescaleBorder() {
		const s = Globals.TILE_SIZE;
		
		if (this.border) {
			this.border.destroy();
		}
		const map = Globals.map;
		
		this.border = this.add.rectangle(-this.borderSize, -this.borderSize, map.mapWidth * s + this.borderSize * 2, map.mapHeight * s + this.borderSize * 2);
		this.border.setStrokeStyle(this.borderSize * 2, 0xfc4445, 1);
		this.border.setOrigin(0, 0);
	}
}
