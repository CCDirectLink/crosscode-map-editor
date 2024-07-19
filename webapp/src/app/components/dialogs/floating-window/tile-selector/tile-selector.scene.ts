import * as Phaser from 'phaser';
import { Subscription } from 'rxjs';

import { Point } from '../../../../models/cross-code-map';
import { SelectedTile } from '../../../../models/tile-selector';
import { Globals } from '../../../../services/globals';
import { Helper } from '../../../../services/phaser/helper';
import { MapPan } from '../../../../services/phaser/map-pan';
import { CCMapLayer } from '../../../../services/phaser/tilemap/cc-map-layer';
import { Vec2 } from '../../../../services/phaser/vec2';
import { customPutTilesAt } from '../../../../services/phaser/tilemap/layer-helper';

export class TileSelectorScene extends Phaser.Scene {
	
	private tileMap?: Phaser.Tilemaps.Tilemap;
	private selecting = false;
	private rect?: Phaser.GameObjects.Rectangle;
	private subs: Subscription[] = [];
	
	private tilesetRendered = false;
	
	// TODO: copypaste - same is in tileDrawer, move somewhere else
	private selectedTiles: SelectedTile[] = [];
	private rightClickStart?: Point;
	private rightClickEnd?: Point;
	
	private keyBindings: { event: string, fun: Function }[] = [];
	private tilesetSize: Point = {x: 0, y: 0};
	
	constructor() {
		super({key: 'main'});
	}
	
	create() {
		this.cameras.main.setBackgroundColor('#616161');
		
		this.game.canvas.oncontextmenu = function (e) {
			e.preventDefault();
		};
		
		this.subs.push(Globals.mapLoaderService.selectedLayer.subscribe(layer => {
			if (layer) {
				this.drawTileset(layer);
			}
		}));
		
		this.subs.push(Globals.phaserEventsService.changeSelectedTiles.subscribe(tiles => {
			this.drawRect(0, 0);
			if (tiles.length === 0) {
				return;
			}
			const baseTile = tiles[0];
			
			let width = 0;
			let height = 0;
			
			for (const tile of tiles) {
				const id = tile.id - tile.offset.x - tile.offset.y * this.tilesetSize.x;
				if (baseTile.id !== id) {
					return;
				}
				width = Math.max(width, tile.offset.x);
				height = Math.max(height, tile.offset.y);
			}
			
			const start = Helper.indexToPoint(baseTile.id, this.tilesetSize.x);
			this.drawRect(width + 1, height + 1, start.x, start.y);
			
		}));
		
		const pan = new MapPan(this, 'mapPan');
		this.add.existing(pan);
		
		this.tileMap = this.add.tilemap(undefined, Globals.TILE_SIZE, Globals.TILE_SIZE);
		
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
		this.keyBindings.push({event: 'pointerupoutside', fun: pointerUp});
		
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
		const p = Helper.worldToTile(pointer.worldX, pointer.worldY);
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
			this.drawRect(0, 0);
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
		
		
		const tilesWithin = this.tileMap!.getTilesWithin(smaller.x, smaller.y, width, height) ?? [];
		
		tilesWithin.forEach((tile: Phaser.Tilemaps.Tile) => {
			this.selectedTiles.push({
				id: tile.index,
				offset: Vec2.sub(tile, smaller, true)
			});
		});
		
		this.rightClickStart = undefined;
		this.rightClickEnd = undefined;
		
		Globals.phaserEventsService.changeSelectedTiles.next(this.selectedTiles);
	}
	
	destroy() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
		this.subs = [];
		this.keyBindings.forEach(binding => {
			this.input.removeListener(binding.event, binding.fun);
		});
		this.keyBindings = [];
	}
	
	
	override update(time: number, delta: number): void {
		const pointer = this.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX, pointer.worldY);
		
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
	
	private async drawTileset(selectedLayer: CCMapLayer) {
		this.tilesetRendered = false;
		this.drawRect(0, 0);
		
		if (!selectedLayer.details.tilesetName) {
			if (this.tileMap) {
				this.tileMap.removeAllLayers();
			}
			return;
		}
		
		if (!this.tileMap) {
			return;
		}
		
		const exists = await Helper.loadTexture(selectedLayer.details.tilesetName, this);
		if (!exists) {
			return;
		}
		
		const tilesetSize = Helper.getTilesetSize(this, selectedLayer.details.tilesetName);
		this.tilesetSize = tilesetSize;
		this.tileMap.removeAllLayers();
		const tileset = this.tileMap.addTilesetImage('tileset', selectedLayer.details.tilesetName, Globals.TILE_SIZE, Globals.TILE_SIZE);
		if (!tileset) {
			return;
		}
		tileset.firstgid = 1;
		const layer = this.tileMap.createBlankLayer('first', tileset, 0, 0, tilesetSize.x, tilesetSize.y)!;
		
		let counter = 1;
		const data: number[][] = [];
		for (let y = 0; y < tilesetSize.y; y++) {
			data[y] = [];
			for (let x = 0; x < tilesetSize.x; x++) {
				data[y][x] = counter;
				counter++;
			}
		}
		
		customPutTilesAt(data, layer);
		
		this.tilesetRendered = true;
	}
	
	private drawRect(width: number, height: number, x = 0, y = 0) {
		if (this.rect) {
			this.rect.destroy();
		}
		if (!this.tilesetRendered) {
			return;
		}
		if (width === 0 || height === 0) {
			return;
		}
		this.rect = this.add.rectangle(x * Globals.TILE_SIZE, y * Globals.TILE_SIZE, width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
		this.rect.setOrigin(0, 0);
		if (Globals.settingsService.getSettings().selectionBoxDark) {
			this.rect.setStrokeStyle(2, 0x333333, 0.9);
		} else {
			this.rect.setStrokeStyle(2, 0xffffff, 0.6);
		}
	}
}
