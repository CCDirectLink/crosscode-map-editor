import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../shared/map-loader.service';
import {Subscription} from 'rxjs';
import {MapPan} from '../shared/phaser/map-pan';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {TileDrawer} from '../shared/phaser/tilemap/tile-drawer';
import {EntityManager} from '../shared/phaser/entities/entity-manager';
import {GlobalEventsService} from '../shared/global-events.service';
import {EditorView} from '../shared/interfaces/editor-view';
import {Globals} from '../shared/globals';
import {HttpClientService} from '../shared/http-client.service';
import {StateHistoryService} from '../history/state-history.service';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit, OnDestroy {
	game: Phaser.Game;
	tileMap: CCMap;
	sub: Subscription;
	
	border: Phaser.Rectangle;
	
	// plugins
	private mapPan: MapPan;
	private tileDrawer: TileDrawer;
	private entityManager: EntityManager;
	
	constructor(private element: ElementRef,
	            private mapLoader: MapLoaderService,
	            private globalEvents: GlobalEventsService,
	            private stateHistory: StateHistoryService,
	            private http: HttpClientService) {
	}
	
	ngOnInit() {
		this.http.getAllFiles().subscribe(res => {
			this.game = new Phaser.Game(screen.width * window.devicePixelRatio, screen.height * window.devicePixelRatio, Phaser.CANVAS, 'content', {
				create: () => this.create(),
				update: () => this.update(),
				render: () => this.render(),
				preload: () => this.preload(res),
			}, undefined, false);
			Globals.game = this.game;
		});
	}
	
	create() {
		const game = this.game;
		this.game['StateHistoryService'] = this.stateHistory;
		this.game['MapLoaderService'] = this.mapLoader;
		
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
		this.sub = this.mapLoader.map.subscribe((map) => {
			if (map) {
				this.tileMap.loadMap(map);
			}
		});
		
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
				console.log(this.game.world.children);
			} else if (view === EditorView.Entities) {
				this.tileDrawer.selectLayer(null);
				this.tileDrawer.deactivate();
				this.entityManager.activate();
			}
		});
		
		this.border = new Phaser.Rectangle(0, 0, 0, 0);
		
		this.mapLoader.selectedLayer.subscribe(layer => this.tileDrawer.selectLayer(layer));
		this.globalEvents.currentView.next(EditorView.Layers);
	}
	
	preload(res) {
		// res.data.forEach(json => {
		// 	this.game.load.json(json, Globals.URL + json);
		// });
		res.images.forEach(img => {
			this.game.load.image(img, Globals.URL + img);
		});
		
		this.game.load.json('definitions.json', 'assets/definitions.json');
		this.game.load.crossOrigin = 'anonymous';
		
		this.game.load.onLoadComplete.addOnce(() => {
			this.globalEvents.loadComplete.next(true);
		});
	}
	
	update() {
		if (this.tileMap.layers.length === 0) {
			return;
		}
		const s = this.tileMap.layers[0].details.tilesize * this.game.camera.scale.x;
		this.border.resize(this.tileMap.mapWidth * s, this.tileMap.mapHeight * s);
		
		// should only sort when needed, refactor when performance becomes a problem
		// this.game.world.sort('zIndex');
		this.game.world.children.sort((a: any, b: any) => {
			const va = a.zIndex || 0;
			const vb = b.zIndex || 0;
			const diff = va - vb;
			if (diff !== 0) {
				return diff;
			}
			return a.z - b.z;
		});
	}
	
	render() {
		this.game.debug.geom(this.border, '#F00', false);
	}
	
	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
