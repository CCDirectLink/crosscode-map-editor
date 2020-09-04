import * as Phaser from 'phaser';
import {EditorView} from '../../models/editor-view';
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
	private borderVisible = true;
	
	constructor() {
		super({key: 'main'});
	}
	
	preload() {
		
		this.load.image('pixel', 'assets/pixel.png');
		
		this.load.json('destructibles.json', 'assets/destructibles.json');
		this.load.json('destructible-types.json', 'assets/destructible-types.json');
		this.load.crossOrigin = 'anonymous';
		
		// this.load.on('progress', (val: number) => console.log(val));
		
		// this.load.maxParallelDownloads = this.res.images.length;
		this.load.once('complete', () => Globals.globalEventsService.loadComplete.next());
	}
	
	create() {
		const game = this.game;
		this.cameras.main.setBackgroundColor('#616161');
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		game.scale.scaleMode = Phaser.Scale.ScaleModes.NONE;
		
		const entityManager = new EntityManager(this, false);
		
		const tileMap = new CCMap(game, this, entityManager);
		Globals.map = tileMap;
		
		this.sub = Globals.mapLoaderService.map.subscribe((map) => {
			if (map) {
				tileMap.loadMap(map);
				this.rescaleBorder();
			}
		});
		Globals.phaserEventsService.updateMapBorder.subscribe(() => this.rescaleBorder());
		Globals.phaserEventsService.showMapBorder.subscribe(visible => {
			if (this.border) {
				this.border.visible = visible;
			}
			this.borderVisible = visible;
		});
		
		const pan = new MapPan(this, 'mapPan');
		this.add.existing(pan);
		
		const tileDrawer = new TileDrawer(this);
		this.add.existing(tileDrawer);
		
		this.add.existing(entityManager);
		
		Globals.globalEventsService.currentView.subscribe(view => {
			tileDrawer.setActive(false);
			entityManager.setActive(false);
			switch (view) {
				case EditorView.Layers:
					tileDrawer.setActive(true);
					break;
				case EditorView.Entities:
					entityManager.setActive(true);
					break;
			}
		});
		
		Globals.globalEventsService.currentView.next(EditorView.Layers);
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
		this.border.visible = this.borderVisible;
	}
}
