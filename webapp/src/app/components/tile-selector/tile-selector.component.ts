import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import * as Phaser from 'phaser-ce';
import { MapLoaderService } from '../../shared/map-loader.service';
import { CCMapLayer } from '../../shared/phaser/tilemap/cc-map-layer';
import { MapLayer } from '../../models/cross-code-map';
import { Globals } from '../../shared/globals';
import { Helper } from '../../shared/phaser/helper';
import { HttpClientService } from '../../services/http-client.service';
import { ISelectedTiles } from '../../models/tile-selector';


@Component({
	selector: 'app-tile-selector',
	templateUrl: './tile-selector.component.html',
	styleUrls: ['./tile-selector.component.scss']
})
export class TileSelectorComponent implements OnInit {
	private display: Phaser.Game;
	private tileSelector: CCMapLayer;
	private group: Phaser.Group;
	private graphics: Phaser.Graphics;
	private border = new Phaser.Rectangle(0, 0, 0, 0);

	private selecting = false;
	private selectionStart: Phaser.Point;
	private selected: ISelectedTiles = { tiles: [], size: new Phaser.Point(1, 1) };

	@Output()
	selectionChanged = new EventEmitter<ISelectedTiles>();
	
	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService) {
	}
	
	ngOnInit() {
		this.http.getAllTilesets().subscribe(res => {
			this.display = new Phaser.Game(
				300 * window.devicePixelRatio,
				300 * window.devicePixelRatio,
				Phaser.CANVAS,
				'tile-selector-content', {
					create: () => this.create(),
					render: () => this.render(),
					preload: () => this.preload(res),
				},
				undefined,
				false);
			});
	}
	
	private drawTileset(selectedLayer: CCMapLayer) {
		if (!this.display.load.hasLoaded) {
			this.display.load.onFileComplete.addOnce(() => this.drawTileset(selectedLayer));
			return;
		}

		// create tileset selector map
		if (this.tileSelector) {
			this.tileSelector.destroy();
			this.group.remove(this.tileSelector);
		}

		const tilesetSize = Helper.getTilesetSize(this.display.cache.getImage(selectedLayer.details.tilesetName));
		
		const details: MapLayer = <MapLayer>{};
		details.width = tilesetSize.x;
		details.height = tilesetSize.y;
		details.tilesetName = selectedLayer.details.tilesetName;
		details.tilesize = Globals.TILE_SIZE;
		details.data = new Array(details.height);

		this.display.scale.setGameSize(details.width * details.tilesize, details.height * details.tilesize);
		this.display.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		
		const scale = 1 / window.devicePixelRatio;
		this.display.scale.setUserScale(scale, scale);
		
		let counter = 1;
		
		for (let y = 0; y < details.height; y++) {
			details.data[y] = [];
			for (let x = 0; x < details.width; x++) {
				details.data[y][x] = counter;
				counter++;
			}
		}
		
		this.tileSelector = new CCMapLayer(this.display, details);
		this.tileSelector.backgroundColor = {r: 255, g: 128, b: 0, a: 1};
		
		this.tileSelector.renderAll();
		this.tileSelector.visible = true;
		
		this.group.add(this.tileSelector, false, 0);
	}
	
	private create() {
		const display = this.display;
		display.time.advancedTiming = true;
		display.stage.backgroundColor = '#616161';
		display.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		display.world.setBounds(-100000, -100000, 200000, 200000);
		
		display.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		
		const scale = 1 / window.devicePixelRatio;
		display.scale.setUserScale(scale, scale);
		
		display.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.display.canvas);
		
		this.mapLoader.selectedLayer.subscribe((layer) => {
			if (layer) {
				this.drawTileset(layer);
			}
		});

		
		this.group = display.add.group();
		this.graphics = display.add.graphics(0, 0);
		this.group.add(this.graphics);

		display.input.mousePointer.rightButton.onDown.add(() => this.onMouseRightDown());
		display.input.mousePointer.rightButton.onUp.add(() => this.onMouseRightUp());
		display.input.mousePointer.leftButton.onUp.add(() => this.onMouseLeftUp());
	}

	private render() {
		if (this.selecting) {
			this.calculateBorder();
			this.drawBorder();
		}
	}

	private preload(images: string[]) {
		this.display.load.images(images, images.map(i => Globals.URL + i));
		this.display.load.maxParallelDownloads = images.length;
	}

	private onMouseRightDown() {
		this.selecting = true;
		const x = Math.floor(this.display.input.x / 16) * 16;
		const y = Math.floor(this.display.input.y / 16) * 16;

		this.selectionStart = new Phaser.Point(x, y);
	}

	private onMouseRightUp() {
		this.selecting = false;
		
		if (this.tileSelector) {
			this.tileSelector.renderAll();
		}

		this.calculateBorder();
		this.drawBorder();
		this.updateSelection();
	}
	
	private onMouseLeftUp() {
		const duration = this.display.input.mousePointer.leftButton.timeUp - this.display.input.mousePointer.leftButton.timeDown;
		if (duration <= 250) {
			this.onMouseRightDown();
			this.onMouseRightUp();
		}
	}

	private calculateBorder() {
		let ex = Math.floor(this.display.input.x / Globals.TILE_SIZE) * Globals.TILE_SIZE;
		let ey = Math.floor(this.display.input.y / Globals.TILE_SIZE) * Globals.TILE_SIZE;

		let sx = this.selectionStart.x;
		let sy = this.selectionStart.y;

		// Extend by one tile if the cursor is right or below
		if (ex >= sx) {
			ex += Globals.TILE_SIZE;
		}
		if (ey >= sy) {
			ey += Globals.TILE_SIZE;
		}

		// Extend by one tile if the start of the selection is right or below
		if (sx >= ex) {
			sx += Globals.TILE_SIZE;
		}
		if (sy >= ey) {
			sy += Globals.TILE_SIZE;
		}
		
		this.border = new Phaser.Rectangle(sx, sy, ex - sx, ey - sy);
	}

	private drawBorder() {
		this.graphics.clear();
		this.graphics.lineStyle(1, 0xFFFFFF, 0.7);
		this.graphics.drawRect(this.border.x, this.border.y, this.border.width, this.border.height);
	}

	private updateSelection() {
		let sx = this.border.x / Globals.TILE_SIZE;
		let sy = this.border.y / Globals.TILE_SIZE;

		let width = this.border.width / Globals.TILE_SIZE;
		let height = this.border.height / Globals.TILE_SIZE;

		if (width < 0) {
			sx += width;
			width = -width;
		}

		if (height < 0) {
			sy += height;
			height = -height;
		}

		this.selected.tiles = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this.selected.tiles.push({
					id: this.tileSelector.details.data[sy + y][sx + x],
					offset: new Phaser.Point(x, y),
				});
			}
		}

		this.selected.size = new Phaser.Point(width, height);

		this.selectionChanged.emit({
			tiles: this.selected.tiles,
			size: this.selected.size,
		});
	}
}
