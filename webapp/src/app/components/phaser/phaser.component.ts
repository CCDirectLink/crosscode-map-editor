import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Input} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../../shared/map-loader.service';
import {Subscription} from 'rxjs';
import {MapPan} from '../../shared/phaser/map-pan';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {TileDrawer} from '../../shared/phaser/tilemap/tile-drawer';
import {EntityManager} from '../../shared/phaser/entities/entity-manager';
import {GlobalEventsService} from '../../shared/global-events.service';
import {EditorView} from '../../models/editor-view';
import {Globals} from '../../shared/globals';
import {HttpClientService} from '../../services/http-client.service';
import {ResourceManagerService} from '../../shared/resource-manager.service';
import {StateHistoryService} from '../../shared/history/state-history.service';
import {PhaserEventsService} from '../../shared/phaser/phaser-events.service';
import {HeightMapGeneratorService} from '../../services/height-map-generator.service';
import { FileInfos } from '../../models/file-infos';
import { ISelectedTiles } from '../../models/tile-selector';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit, OnDestroy {
	game: Phaser.Game;
	tileMap: CCMap;
	sub: Subscription;
	private fpsLogCounter = 0;
	
	border: Phaser.Rectangle;
	
	// plugins
	private mapPan: MapPan;
	private tileDrawer: TileDrawer;
	private entityManager: EntityManager;
	
	@Input()
	set selected(value: ISelectedTiles) {
		if (this.tileDrawer) {
			this.tileDrawer.select(value);
		}
	}

	constructor(private element: ElementRef,
	            private mapLoader: MapLoaderService,
	            private globalEvents: GlobalEventsService,
	            private stateHistory: StateHistoryService,
	            private phaserEventsService: PhaserEventsService,
				private http: HttpClientService,
				private resourceManager: ResourceManagerService,
	            private heightGenerator: HeightMapGeneratorService) {
	}

	
	ngOnInit() {
		this.http.getAllFiles().subscribe(res => {
			this.game = new Phaser.Game(
				screen.width * window.devicePixelRatio,
				screen.height * window.devicePixelRatio,
				Phaser.WEBGL_MULTI,
				'content', {
					create: () => this.create(),
					update: () => this.update(),
					render: () => this.render(),
					preload: () => this.preload(res),
				},
				undefined,
				false);
			Globals.game = this.game;
		});
	}
	
	create() {
		const game = this.game;
		game.time.advancedTiming = true;
		this.game['StateHistoryService'] = this.stateHistory;
		this.game['MapLoaderService'] = this.mapLoader;
		this.game['PhaserEventsService'] = this.phaserEventsService;
		this.game['GlobalEventsService'] = this.globalEvents;
		
		game.stage.backgroundColor = '#616161';
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		game.world.setBounds(-100000, -100000, 200000, 200000);
		
		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		
		const scale = 1 / window.devicePixelRatio;
		game.scale.setUserScale(scale, scale);
		
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		
		this.tileMap = new CCMap(game);
		Globals.map = this.tileMap;
		this.sub = this.mapLoader.map.subscribe((map) => {
			if (map) {
				this.tileMap.loadMap(map);
				this.rescaleBorder();
			}
		});
		
		this.phaserEventsService.updateMapBorder.subscribe(a => this.rescaleBorder());
		
		// plugins
		this.mapPan = game.plugins.add(MapPan);
		this.entityManager = game.plugins.add(EntityManager);
		this.entityManager.setGlobalEvents(this.globalEvents);
		this.tileDrawer = game.plugins.add(TileDrawer);
		
		this.globalEvents.currentView.subscribe(view => {
			if (view === EditorView.Layers) {
				this.tileDrawer.activate();
				this.tileDrawer.selectLayer(this.mapLoader.selectedLayer.getValue(), this.tileMap);
				this.entityManager.deactivate();
			} else if (view === EditorView.Entities) {
				this.tileDrawer.selectLayer(null);
				this.tileDrawer.deactivate();
				this.entityManager.activate();
			}
		});
		
		this.border = new Phaser.Rectangle(0, 0, 0, 0);
		this.mapLoader.selectedLayer.subscribe(layer => this.tileDrawer.selectLayer(layer));
		this.globalEvents.currentView.next(EditorView.Layers);
		
		this.heightGenerator.init(game);
	}
	
	preload(res: FileInfos) {
		// res.data.forEach(json => {
		// 	this.game.load.json(json, Globals.URL + json);
		// });
		this.game.load.images(res.images, res.images.map(i => Globals.URL + i));
		
		this.game.load.json('definitions.json', 'assets/definitions.json');
		this.game.load.json('destructibles.json', 'assets/destructibles.json');
		this.game.load.crossOrigin = 'anonymous';
		
		this.game.load.maxParallelDownloads = res.images.length;

		this.game.load.onLoadComplete.addOnce(() => {
			this.globalEvents.loadComplete.next(true);
		});
	}
	
	update() {
		if (Globals.zIndexUpdate) {
			Globals.zIndexUpdate = false;
			this.game.world.children.sort(this.sortFunc);
		}
	}
	
	sortFunc(a, b) {
		const va = a.zIndex || 0;
		const vb = b.zIndex || 0;
		const diff = va - vb;
		if (diff !== 0) {
			return diff;
		}
		return a.z - b.z;
		
	}
	
	render() {
		// expensive call, use only for debugging
		// this.game.debug.text(this.game.time.fps.toString(), 2, 14, '#00ff00');
		
		this.game.debug.geom(this.border, '#F00', false);
	}
	
	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
	
	private rescaleBorder() {
		if (!this.tileMap.layers) {
			return;
		}
		const s = this.tileMap.layers[0].details.tilesize * this.game.camera.scale.x;
		this.border.resize(this.tileMap.mapWidth * s, this.tileMap.mapHeight * s);
	}
}
