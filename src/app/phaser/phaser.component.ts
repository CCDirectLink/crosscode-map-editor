import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../shared/map-loader.service';
import {Subscription} from 'rxjs/Subscription';
import {CrossCodeMap} from '../shared/interfaces/cross-code-map';
import {MapPan} from '../shared/phaser/map-pan';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {TileDrawer} from '../shared/phaser/tilemap/tile-drawer';

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

	constructor(private element: ElementRef, private mapLoader: MapLoaderService) {
		mapLoader.map.subscribe((v) => console.log('wohay', v));
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
					console.log('map loaded');
					if (map) {
						this.tileMap.loadMap(map).then(tilemap => {
							this.mapLoader.tileMap.next(tilemap);
							this.mapLoader.selectedLayer.next(tilemap.layers[0]);
						});
					}
				});

				this.border = new Phaser.Rectangle(0, 0, 0, 0);

				// plugins
				this.mapPan = game.plugins.add(MapPan);
				this.tileDrawer = game.plugins.add(TileDrawer);
				this.mapLoader.selectedLayer.subscribe(layer => this.tileDrawer.selectLayer(layer));

			},
			update: () => this.update(),
			render: () => this.render(),
		}, undefined, false);
	}

	update() {
		if (this.tileMap.layers.length === 0) {
			return;
		}
		const s = this.tileMap.layers[0].details.tilesize * this.game.camera.scale.x;
		this.border.resize(this.tileMap.mapWidth * s, this.tileMap.mapHeight * s);

		// should only sort when needed, refactor when performance becomes a problem
		this.game.world.sort('zIndex');
		// this.game.world.children.sort((a: any, b: any) => {
		// 	const va = a.zIndex || 0;
		// 	const vb = b.zIndex || 0;
		// 	const diff = va - vb;
		// 	if (diff !== 0) {
		// 		return diff;
		// 	}
		// 	return a.z - b.z;
		// });
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
