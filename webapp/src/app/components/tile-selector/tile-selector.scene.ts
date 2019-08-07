import * as Phaser from 'phaser';
import {CCMapLayer} from '../../renderer/phaser/tilemap/cc-map-layer';
import {Helper} from '../../renderer/phaser/helper';
import {Point} from '../../models/cross-code-map';
import {MapPan} from '../../renderer/phaser/map-pan';
import {Subscription} from 'rxjs';
import {SelectedTile} from '../../models/tile-selector';
import {Vec2} from '../../renderer/phaser/vec2';
import { LoaderService } from '../../services/loader.service';
import { SettingsService } from '../../services/settings.service';
import { EventService } from '../../services/event.service';

export class TileSelectorScene extends Phaser.Scene {
	
	private tileMap?: Phaser.Tilemaps.Tilemap;
	private selecting = false;
	private rect?: Phaser.GameObjects.Rectangle;
	private sub?: Subscription;
	
	private tilesetRendered = false;
	
	// TODO: copypaste - same is in tileDrawer, move somewhere else
	private selectedTiles: SelectedTile[] = [];
	private rightClickStart?: Point;
	private rightClickEnd?: Point;
	
	private keyBindings: { event: string, fun: Function }[] = [];
	private tilesetSize: Point = {x: 0, y: 0};
	
	constructor(
		private readonly settings: SettingsService,
		private readonly loader: LoaderService,
		private readonly eventsService: EventService,
	) {
		super({key: 'main'});
	}
	
	create() {
		this.cameras.main.setBackgroundColor('#616161');
		
		this.game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		this.sub = this.loader.selectedLayer.subscribe((layer) => {
			if (layer) {
				this.drawTileset(layer);
			}
		});
		
		const pan = new MapPan(this.eventsService, this, 'mapPan');
		this.add.existing(pan);
		
		this.tileMap = this.add.tilemap(undefined, this.settings.TILE_SIZE, this.settings.TILE_SIZE);
		
		this.keyBindings = [];
		const pointerDown = (pointer: Phaser.Input.Pointer) => {
			if (pointer.rightButtonDown() || pointer.leftButtonDown()) {
				this.onMouseDown();
			}
		};
		this.keyBindings.push({event: 'pointerdown', fun: pointerDown});
		
		const pointerUp = (pointer: Phaser.Input.Pointer) => {
			if (pointer.rightButtonReleased() || pointer.leftButtonReleased()) {
				this.onMouseUp();
			}
		};
		this.keyBindings.push({event: 'pointerup', fun: pointerUp});
		
		this.keyBindings.forEach(binding => {
			this.input.addListener(binding.event, binding.fun);
		});
	}
	
	private onMouseDown() {
		if (!this.tilesetRendered) {
			return;
		}
		
		// only start tile copy when cursor in bounds
		const pointer = this.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX, pointer.worldY, this.settings);
		if (!Helper.isInBoundsP(this.tilesetSize, p)) {
			return;
		}
		
		this.rightClickStart = p;
	}
	
	public resize() {
		const size = this.scale.gameSize;
		this.game.scale.resize(size.width, size.height);
	}
	
	private onMouseUp() {
		if (!this.tilesetRendered) {
			return;
		}
		this.selectedTiles = [];
		
		// cancel current selection when out of bounds
		if (!this.rightClickStart || !this.rightClickEnd) {
			this.drawRect(1, 1);
			return;
		}
		
		// select tiles
		const start = this.rightClickStart;
		const end = this.rightClickEnd;
		
		const smaller = {
			x: Math.min(start.x, end.x),
			y: Math.min(start.y, end.y)
		};
		
		const bigger = {
			x: Math.max(start.x, end.x),
			y: Math.max(start.y, end.y)
		};
		
		const width = bigger.x - smaller.x + 1;
		const height = bigger.y - smaller.y + 1;
		
		
		const tilesWithin = this.tileMap!.getTilesWithin(smaller.x, smaller.y, width, height);
		
		tilesWithin.forEach((tile: Phaser.Tilemaps.Tile) => {
			this.selectedTiles.push({
				id: tile.index,
				offset: Vec2.sub(tile, smaller, true)
			});
		});
		
		this.drawRect(width, height, smaller.x, smaller.y);
		
		this.rightClickStart = undefined;
		this.rightClickEnd = undefined;
		
		this.eventsService.changeSelectedTiles.next(this.selectedTiles);
	}
	
	destroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
		this.keyBindings.forEach(binding => {
			this.input.removeListener(binding.event, binding.fun);
		});
		this.keyBindings = [];
	}
	
	
	update(time: number, delta: number): void {
		const pointer = this.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX, pointer.worldY, this.settings);
		
		// render selection border
		if (this.rightClickStart) {
			p.x = Helper.clamp(p.x, 0, this.tilesetSize.x - 1);
			p.y = Helper.clamp(p.y, 0, this.tilesetSize.y - 1);
			
			if (this.rightClickEnd && this.rightClickEnd.x === p.x && this.rightClickEnd.y === p.y) {
				// shortcut to avoid redrawing rectangle every frame
				return;
			}
			
			this.rightClickEnd = p;
			const diff = Vec2.sub(p, this.rightClickStart, true);
			const start = {x: this.rightClickStart.x, y: this.rightClickStart.y};
			if (diff.x >= 0) {
				diff.x++;
			} else {
				start.x += 1;
				diff.x--;
			}
			if (diff.y >= 0) {
				diff.y++;
			} else {
				start.y += 1;
				diff.y--;
			}
			
			this.drawRect(diff.x, diff.y, start.x, start.y);
			return;
		}
	}
	
	private drawTileset(selectedLayer: CCMapLayer) {
		if (this.load.isLoading()) {
			this.load.once('complete', () => this.drawTileset(selectedLayer));
			return;
		}
		
		this.tilesetRendered = false;
		this.drawRect(0, 0);
		
		if (!selectedLayer.data.tilesetName) {
			if (this.tileMap) {
				this.tileMap.removeAllLayers();
			}
			return;
		}
		
		if (!this.tileMap) {
			return;
		}
		
		const tilesetSize = Helper.getTilesetSize(this, selectedLayer.data.tilesetName, this.settings);
		this.tilesetSize = tilesetSize;
		this.tileMap.removeAllLayers();
		const tileset = this.tileMap.addTilesetImage('tileset', selectedLayer.data.tilesetName, this.settings.TILE_SIZE, this.settings.TILE_SIZE);
		if (!tileset) {
			this.load.image(selectedLayer.data.tilesetName, this.settings.URL + selectedLayer.data.tilesetName);
			this.load.once('load', () => this.drawTileset(selectedLayer));
			this.load.start();
			return;
		}
		tileset.firstgid = 1;
		const layer = this.tileMap.createBlankDynamicLayer('first', tileset, 0, 0, tilesetSize.x, tilesetSize.y);
		
		let counter = 1;
		const data: number[][] = [];
		for (let y = 0; y < tilesetSize.y; y++) {
			data[y] = [];
			for (let x = 0; x < tilesetSize.x; x++) {
				data[y][x] = counter;
				counter++;
			}
		}
		
		layer.putTilesAt(data, 0, 0);
		
		
		this.tilesetRendered = true;
	}
	
	private drawRect(width: number, height: number, x = 0, y = 0) {
		if (this.rect) {
			this.rect.destroy();
		}
		if (!this.tilesetRendered) {
			return;
		}
		this.rect = this.add.rectangle(x * this.settings.TILE_SIZE, y * this.settings.TILE_SIZE, width * this.settings.TILE_SIZE, height * this.settings.TILE_SIZE);
		this.rect.setOrigin(0, 0);
		this.rect.setStrokeStyle(1, 0xffffff, 0.6);
	}
}
