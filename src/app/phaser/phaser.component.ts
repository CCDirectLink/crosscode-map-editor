import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../shared/map-loader.service';
import {Subscription} from 'rxjs/Subscription';
import {CrossCodeMap} from '../shared/interfaces/cross-code-map';
import {MapPan} from '../shared/phaser/map-pan';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {TileDrawer} from '../shared/phaser/tilemap/tile-drawer';
import {EntityManager} from '../shared/phaser/entities/entity-manager';
import {GlobalEventsService} from '../shared/global-events.service';
import {EditorView} from '../shared/interfaces/editor-view';
import {Globals} from '../shared/globals';
import {PropSheet, ScalableProp} from '../shared/interfaces/props';

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

	constructor(private element: ElementRef, private mapLoader: MapLoaderService, private globalEvents: GlobalEventsService) {
	}

	ngOnInit() {
		this.game = new Phaser.Game(screen.width * window.devicePixelRatio, screen.height * window.devicePixelRatio, Phaser.CANVAS, 'content', {
			create: () => {
				const game = this.game;

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
						this.tileMap.loadMap(map).then(tilemap => {
							this.mapLoader.tileMap.next(tilemap);
							this.mapLoader.selectedLayer.next(tilemap.layers[0]);
						});
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
						this.tileDrawer.selectLayer(this.mapLoader.selectedLayer.getValue());
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

			},
			update: () => this.update(),
			render: () => this.render(),
			preload: () => this.preload(),
		}, undefined, false);
		Globals.game = this.game;
	}

	preload() {
		let props: any = 'autumn.json\n' +
			'bergen.json\n' +
			'bergen-inner.json\n' +
			'bergen-trail.json\n' +
			'cabins.json\n' +
			'cargo-hold.json\n' +
			'cave.json\n' +
			'cold-dng.json\n' +
			'dungeon-ar.json\n' +
			'heat.json\n' +
			'heat-dng.json\n' +
			'heat-interior.json\n' +
			'heat-village.json\n' +
			'hideout.json\n' +
			'invisible.json\n' +
			'jungle.json\n' +
			'jungle-city.json\n' +
			'jungle-interior.json\n' +
			'jungle-signs.json\n' +
			'office.json\n' +
			'rh-interior.json\n' +
			'rhombus-interior.json\n' +
			'rhombus-sqr.json\n' +
			'rhombus-square-view.json\n' +
			'rookie-harbor.json\n' +
			'ship-bridge.json\n' +
			'ship-outer.json\n' +
			'shockwave-dng.json\n' +
			'spooky.json\n' +
			'trading-autumn.json\n' +
			'unknown-interior.json\n' +
			'upgrade-glow.json\n' +
			'upgrade-symbols.json\n' +
			'various.json';

		props = props.split('\n');

		props.forEach(prop => {
			this.game.load.json('props/' + prop.split('.')[0], Globals.URL + 'data/props/' + prop);
		});

		let scalableProps: any = 'autumn.json\n' +
			'bergen-trail.json\n' +
			'cave.json\n' +
			'cold-dng.json\n' +
			'dungeon-ar.json\n' +
			'heat-area.json\n' +
			'heat-dng.json\n' +
			'heat-village.json\n' +
			'hideout.json\n' +
			'jungle-city.json\n' +
			'jungle.json\n' +
			'rh-interior.json\n' +
			'rhombus-sqr-inner.json\n' +
			'rhombus-sqr.json\n' +
			'rookie-harbor.json\n' +
			'ship-outer.json\n' +
			'shockwave-dng.json';

		scalableProps = scalableProps.split('\n');

		scalableProps.forEach(prop => {
			this.game.load.json('scale-props/' + prop.split('.')[0], Globals.URL + 'data/scale-props/' + prop);
		});

		this.game.load.json('definitions.json', 'assets/definitions.json');
		this.game.load.json('media.json', 'assets/media.json');
		this.game.load.crossOrigin = 'anonymous';

		this.game.load.onLoadComplete.addOnce(() => {
			const allMedia = this.game.cache.getJSON('media.json');
			allMedia.forEach(media => {
				this.game.load.image(media, Globals.URL + media, false);
			});

			setTimeout(() => {
				this.game.load.crossOrigin = 'anonymous';
				this.game.load.start();
			}, 0);
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
