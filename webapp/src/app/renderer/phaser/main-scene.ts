import * as Phaser from 'phaser';
import {EditorView} from '../../models/editor-view';
import {StateHistoryService} from '../../history/state-history.service';
import {LoaderService} from '../../services/loader.service';
import {PhaserEventsService} from './phaser-events.service';
import {FileInfos} from '../../models/file-infos';
import {CCMap} from './tilemap/cc-map';
import {Subscription} from 'rxjs';
import {MapPan} from './map-pan';
import {TileDrawer} from './tilemap/tile-drawer';
import {EntityManager} from './entities/entity-manager';
import { SettingsService } from '../../services/settings.service';
import { EventService } from '../../services/event.service';

export class MainScene extends Phaser.Scene {
	
	private readonly borderSize = 1;
	
	private border?: Phaser.GameObjects.Rectangle;
	private sub?: Subscription;
	
	constructor(
		private res: FileInfos,
		private readonly settings: SettingsService,
		private readonly eventsService: EventService,
		private readonly loader: LoaderService,
		private readonly stateHistory: StateHistoryService,
	) {
		super({key: 'main'});
	}
	
	preload() {
		this.res.images.forEach(img => {
			this.load.image(img, this.settings.URL + img);
		});
		
		this.load.image('pixel', 'assets/pixel.png');
		
		this.load.json('definitions.json', 'assets/definitions.json');
		this.load.json('destructibles.json', 'assets/destructibles.json');
		this.load.crossOrigin = 'anonymous';
		
		// this.load.on('progress', (val: number) => console.log(val));
		
		// this.load.maxParallelDownloads = this.res.images.length;
		this.load.once('complete', () => this.eventsService.loadComplete.next());
	}
	
	create() {
		const game = this.game;
		
		this.cameras.main.setBackgroundColor('#616161');
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		game.scale.scaleMode = Phaser.Scale.ScaleModes.NONE;
		
		const entityManager = new EntityManager(this.eventsService, this.settings, this, false);
		
		const tileMap = new CCMap(game, this, entityManager, this.settings, this.loader, this.eventsService, this.stateHistory);
		this.settings.map = tileMap;
		
		this.sub = this.loader.map.subscribe((map) => {
			if (map) {
				tileMap.loadMap(map);
				this.rescaleBorder();
			}
		});
		this.eventsService.updateMapBorder.subscribe(() => this.rescaleBorder());
		
		const pan = new MapPan(this.eventsService, this, 'mapPan');
		this.add.existing(pan);
		
		const tileDrawer = new TileDrawer(this.settings, this.loader, this.eventsService, this.stateHistory, this);
		this.add.existing(tileDrawer);
		
		this.add.existing(entityManager);
		
		this.eventsService.currentView.subscribe(view => {
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
		
		this.eventsService.currentView.next(EditorView.Layers);
		
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
		const s = this.settings.TILE_SIZE;
		
		if (this.border) {
			this.border.destroy();
		}
		const map = this.settings.map;
		
		this.border = this.add.rectangle(-this.borderSize, -this.borderSize, map.mapWidth * s + this.borderSize * 2, map.mapHeight * s + this.borderSize * 2);
		this.border.setStrokeStyle(this.borderSize * 2, 0xfc4445, 1);
		this.border.setOrigin(0, 0);
	}
}
