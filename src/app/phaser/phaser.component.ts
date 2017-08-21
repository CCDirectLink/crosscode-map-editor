import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as Phaser from 'phaser-ce';
import {MapLoaderService} from '../shared/map-loader.service';
import {Subscription} from 'rxjs/Subscription';
import {CrossCodeMap} from '../shared/interfaces/cross-code-map';
import {MapPan} from '../shared/phaser/map-pan';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit, OnDestroy {
	game: Phaser.Game;
	tileMap: Phaser.Tilemap;
	sub: Subscription;
	map: CrossCodeMap;
	mapPan: MapPan;

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
				game.world.setBounds(-600, -600, 30000, 20000);

				game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

				const scale = 1 / window.devicePixelRatio;
				game.scale.setUserScale(scale, scale);

				game.renderer.renderSession.roundPixels = true;
				Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

				this.tileMap = game.add.tilemap();
				this.game.load.onLoadComplete.add(() => this.onLoadComplete());

				// scroller plugin
				this.mapPan = game.plugins.add(MapPan);
			}
		}, undefined, false);
		this.sub = this.mapLoader.map.subscribe((map) => this.loadMap(map));
	}

	loadMap(map: CrossCodeMap) {
		const game = this.game;
		this.map = map;

		if (!map) {
			return;
		}
		// TODO: unload previous stuff first
		map.layer.forEach(layer => {
			game.load.image(layer.tilesetName, 'http://localhost:8080/' + layer.tilesetName);
		});
		game.load.start();
	}

	onLoadComplete() {
		const game = this.game;
		this.createTilemap();

		game.camera.scale.setTo(1);
		console.log(game.camera);
	}

	createTilemap() {
		const game = this.game;
		const map = this.map;

		this.tileMap.destroy();
		this.tileMap = game.add.tilemap();
		const tileMap = this.tileMap;

		const firstLayer = tileMap.create('delete', map.mapWidth, map.mapHeight, map.layer[0].tilesize, map.layer[0].tilesize);

		const layers: Phaser.TilemapLayer[] = [];

		// generate layer
		let firstGid = 0;
		map.layer.forEach((layer, k) => {
			// if (k !== 3 && k !== 0) {
			// 	return;
			// }
			const index = tileMap.getTilesetIndex(layer.tilesetName);
			let tileset: Phaser.Tileset;
			if (index !== null) {
				tileset = tileMap.tilesets[index];
			} else {
				tileset = tileMap.addTilesetImage(layer.tilesetName, undefined, layer.tilesize, layer.tilesize, undefined, undefined, firstGid);
				firstGid += layer.height * layer.width;
			}

			const newLayer = tileMap.createBlankLayer('' + layer.id, layer.width, layer.height, layer.tilesize, layer.tilesize);
			newLayer.crossCode = {
				name: layer.name,
				level: layer.level,
				type: layer.type
			};

			const types = 'Collision Navigation'.split(' ');
			types.forEach(type => {
				if (layer.type === type) {
					newLayer.visible = false;
				}
			});


			for (let i = 0; i < layer.data.length; i++) {
				for (let j = 0; j < layer.data[i].length; j++) {
					let gid = layer.data[i][j] + tileset.firstgid - 1;
					if (gid < tileset.firstgid) {
						gid = -1;
					}
					tileMap.putTile(gid, j, i, newLayer);
				}
			}
			layers.push(newLayer);
		});

		firstLayer.destroy();
		tileMap.layers.shift();
		this.mapLoader.tileMap.next(tileMap);
		this.mapLoader.layers.next(layers);
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
