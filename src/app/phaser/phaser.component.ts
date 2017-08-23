import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../shared/map-loader.service';
import {Subscription} from 'rxjs/Subscription';
import {CrossCodeMap} from '../shared/interfaces/cross-code-map';
import {MapPan} from '../shared/phaser/map-pan';
import {CCMap} from '../shared/phaser/tilemap/cc-map';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit, OnDestroy {
	game: Phaser.Game;
	tileMap: CCMap;
	sub: Subscription;
	mapPan: MapPan;

	border: Phaser.Rectangle;

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
						this.tileMap.loadMap(map).then(tilemap => this.mapLoader.tileMap.next(tilemap));
					}
				});

				this.border = new Phaser.Rectangle(0, 0, 100, 100);

				// scroller plugin
				this.mapPan = game.plugins.add(MapPan);
			},
			update: () => this.update(),
			render: () => this.render(),
		}, undefined, false);
	}

	update() {
		if (this.tileMap.layers.length === 0) {
			return;
		}
		const s = this.tileMap.layers[0].details.tilesize;
		this.border.resize(this.tileMap.mapWidth * s, this.tileMap.mapHeight * s);
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
