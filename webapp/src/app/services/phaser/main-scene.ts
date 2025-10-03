import * as Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { EditorView } from '../../models/editor-view';
import { Globals } from '../globals';
import { CoordsReporter } from './coords-reporter';
import { EntityManager } from './entities/entity-manager';
import { EntityGrid } from './entity-grid';
import { IngamePreview } from './ingame-preview';
import { LayerParallax } from './layer-parallax';
import { MapPan } from './map-pan';
import { CCMap } from './tilemap/cc-map';
import { TileDrawer } from './tilemap/tile-drawer';

export class MainScene extends Phaser.Scene {
	private sub?: Subscription;

	constructor() {
		super({ key: 'main' });
	}

	preload() {
		this.load.image('pixel', 'assets/pixel.png');
		this.load.image('ingame', 'assets/ingame.png');

		this.load.crossOrigin = 'anonymous';

		// this.load.on('progress', (val: number) => console.log(val));

		// this.load.maxParallelDownloads = this.res.images.length;
		this.load.once('complete', () =>
			Globals.globalEventsService.loadComplete.next(),
		);
	}

	create() {
		const game = this.game;
		this.cameras.main.setBackgroundColor('#616161');
		this.cameras.main.setRoundPixels(false);
		game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};

		game.scale.scaleMode = Phaser.Scale.ScaleModes.NONE;

		const entityManager = new EntityManager(this, false);

		const tileMap = new CCMap(game, this, entityManager);
		Globals.map = tileMap;

		this.sub = Globals.mapLoaderService.map.subscribe((map) => {
			if (map) {
				const _ = tileMap.loadMap(map);

				// reset camera position on map load
				const cam = this.cameras.main;
				cam.zoom = 1;

				// offset tile selector
				const s = Globals.TILE_SIZE;
				const offset = 400 * window.devicePixelRatio;
				cam.centerOn(
					(map.mapWidth * s) / 2 + offset,
					(map.mapHeight * s) / 2,
				);
			}
		});

		const pan = new MapPan(this, 'mapPan');
		this.add.existing(pan);

		const tileDrawer = new TileDrawer(this);
		this.add.existing(tileDrawer);

		this.add.existing(entityManager);

		const preview = new IngamePreview(this);
		this.add.existing(preview);
		this.add.existing(new LayerParallax(this, preview));

		const coordsReporter = new CoordsReporter(this);
		this.add.existing(coordsReporter);

		const grid = new EntityGrid(this);
		this.add.existing(grid);

		Globals.globalEventsService.currentView.subscribe((view) => {
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
}
