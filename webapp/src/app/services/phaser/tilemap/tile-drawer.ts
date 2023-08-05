import * as Phaser from 'phaser';
import { Point } from '../../../models/cross-code-map';
import { SelectedTile } from '../../../models/tile-selector';
import { Globals } from '../../globals';
import { BaseObject } from '../base-object';
import { Helper } from '../helper';
import { Vec2 } from '../vec2';
import { CCMapLayer } from './cc-map-layer';
import { Filler } from './fill';
import { pointsInLine } from './points-in-line';
import { customPutTileAt } from './layer-helper';

export class TileDrawer extends BaseObject {
	
	private layer?: CCMapLayer;
	private selectedTiles: SelectedTile[] = [];
	
	private rect?: Phaser.GameObjects.Rectangle;
	
	private previewTileMap!: Phaser.Tilemaps.Tilemap;
	private previewLayer?: Phaser.Tilemaps.TilemapLayer;
	
	private rightClickStart?: Point;
	private rightClickEnd?: Point;
	private renderLayersTransparent = false;
	private rightPointerDown = false;
	
	
	private container!: Phaser.GameObjects.Container;
	
	private transparentKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	private shiftKey!: Phaser.Input.Keyboard.Key;
	private fillKey!: Phaser.Input.Keyboard.Key;
	private lastDraw: Point = {x: -1, y: -1};
	
	private dirty = false;
	
	constructor(scene: Phaser.Scene) {
		super(scene, 'tileDrawer');
	}
	
	protected init() {
		this.fillKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F, false);
		this.transparentKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R, false);
		this.visibilityKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.V, false);
		this.shiftKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false);
		
		this.container = this.scene.add.container(0, 0);
		this.container.depth = 1000;
		
		this.drawRect(1, 1);
		
		this.resetSelectedTiles();
		
		this.previewTileMap = this.scene.add.tilemap(undefined, Globals.TILE_SIZE, Globals.TILE_SIZE);
	}
	
	private selectLayer(selectedLayer?: CCMapLayer) {
		this.layer = selectedLayer;
		
		this.setLayerAlpha();
		
		if (!selectedLayer || !selectedLayer.details.tilesetName) {
			this.container.visible = false;
			return;
		}
		this.container.visible = true;
		const tileset = this.previewTileMap.addTilesetImage('only', selectedLayer.details.tilesetName);
		if (tileset) {
			tileset.firstgid = 1;
		}
	}
	
	private updateSelectedTiles(selected: SelectedTile[]) {
		this.selectedTiles = selected;
		this.renderPreview();
		
		let x = 0;
		let y = 0;
		selected.forEach(tile => {
			const o = tile.offset;
			if (o.x > x) {
				x = o.x;
			}
			if (o.y > y) {
				y = o.y;
			}
		});
		
		this.drawRect(x + 1, y + 1, 0, 0);
	}
	
	
	preUpdate(): void {
		// hide cursor when no map loaded
		if (!this.layer) {
			this.container.visible = false;
			return;
		}
		const pointer = this.scene.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX - this.layer.x, pointer.worldY - this.layer.y);
		
		// render selection border
		if (this.rightClickStart) {
			Helper.clampToBounds(this.layer, p);
			
			if (this.rightClickEnd && this.rightClickEnd.x === p.x && this.rightClickEnd.y === p.y) {
				// shortcut to avoid redrawing rectangle every frame
				return;
			}
			
			this.rightClickEnd = p;
			const diff = Vec2.sub(p, this.rightClickStart, true);
			const start = {x: 0, y: 0};
			if (diff.x >= 0) {
				diff.x++;
			} else {
				start.x = Globals.TILE_SIZE;
				diff.x--;
			}
			if (diff.y >= 0) {
				diff.y++;
			} else {
				start.y = Globals.TILE_SIZE;
				diff.y--;
			}
			
			this.drawRect(diff.x, diff.y, start.x, start.y);
			return;
		}
		
		// position tile drawer border to cursor
		const container = this.container;
		container.x = pointer.worldX;
		container.y = pointer.worldY;
		
		if (container.x < this.layer.x) {
			container.x -= Globals.TILE_SIZE;
		}
		if (container.y < this.layer.y) {
			container.y -= Globals.TILE_SIZE;
		}
		
		container.x -= (container.x - this.layer.x) % Globals.TILE_SIZE;
		container.y -= (container.y - this.layer.y) % Globals.TILE_SIZE;
		
		if (this.previewLayer) {
			Vec2.assign(this.previewLayer, container);
		}
		
		// draw tiles
		// trigger only when mouse is over canvas element (the renderer), avoids triggering when interacting with ui
		if (pointer.leftButtonDown() && pointer.downElement?.nodeName === 'CANVAS' && this.layer) {
			const finalPos = {x: 0, y: 0};
			const startPos = {x: 0, y: 0};
			
			// skip drawing if last frame was the same
			if (this.lastDraw.x === p.x && this.lastDraw.y === p.y) {
				return;
			}
			
			// skip drawing if panning key is down
			if (Globals.panning) {
				return;
			}
			
			this.dirty = true;
			for (const tile of this.selectedTiles) {
				
				finalPos.x = p.x + tile.offset.x;
				finalPos.y = p.y + tile.offset.y;
				
				startPos.x = this.lastDraw.x + tile.offset.x;
				startPos.y = this.lastDraw.y + tile.offset.y;
				
				const points = this.lastDraw.x < 0 ? [finalPos] : pointsInLine(startPos, finalPos);
				for (const point of points) {
					if (Helper.isInBounds(this.layer, point)) {
						const phaserLayer = this.layer.getPhaserLayer();
						if (!phaserLayer) {
							return;
						}
						
						customPutTileAt(tile.id, point.x, point.y, phaserLayer.layer);
						
						if (!this.shiftKey.isDown) {
							Globals.autotileService.drawTile(this.layer, point.x, point.y, tile.id);
						}
					}
				}
			}
			Vec2.assign(this.lastDraw, p);
			
		}
	}
	
	protected deactivate() {
		this.container.visible = false;
		if (this.previewLayer) {
			this.previewLayer.visible = false;
		}
	}
	
	protected activate() {
		if (this.previewLayer) {
			this.previewLayer.visible = true;
		}
		const sub = Globals.mapLoaderService.selectedLayer.subscribe(layer => this.selectLayer(layer));
		this.addSubscription(sub);
		
		const sub2 = Globals.phaserEventsService.changeSelectedTiles.subscribe(tiles => this.updateSelectedTiles(tiles));
		this.addSubscription(sub2);
		
		const pointerDown = (pointer: Phaser.Input.Pointer) => {
			if (pointer.rightButtonDown()) {
				this.onMouseRightDown();
			}
		};
		this.addKeybinding({event: 'pointerdown', fun: pointerDown, emitter: this.scene.input});
		
		const pointerUp = (pointer: Phaser.Input.Pointer) => {
			if (pointer.rightButtonReleased() && this.rightPointerDown) {
				this.onMouseRightUp();
			}
		};
		this.addKeybinding({event: 'pointerup', fun: pointerUp, emitter: this.scene.input});
		this.addKeybinding({event: 'pointerupoutside', fun: pointerUp, emitter: this.scene.input});
		
		
		const fill = () => {
			if (!Helper.isInputFocused()) {
				this.fill();
			}
		};
		this.addKeybinding({event: 'up', fun: fill, emitter: this.fillKey});
		
		
		const leftUp = (pointer: Phaser.Input.Pointer) => {
			if (!pointer.leftButtonReleased()) {
				return;
			}
			
			if (!this.layer) {
				return;
			}
			
			this.lastDraw.x = -1;
			
			if (!this.dirty) {
				return;
			}
			this.dirty = false;
			
			Globals.stateHistoryService.saveState({
				name: 'Tile Drawer',
				icon: 'create',
			});
		};
		this.addKeybinding({event: 'pointerup', fun: leftUp, emitter: this.scene.input});
		this.addKeybinding({event: 'pointerupoutside', fun: leftUp, emitter: this.scene.input});
		
		const transparent = () => {
			if (!Helper.isInputFocused()) {
				this.renderLayersTransparent = !this.renderLayersTransparent;
				this.setLayerAlpha();
			}
		};
		this.addKeybinding({event: 'up', fun: transparent, emitter: this.transparentKey});
		
		const visible = () => {
			if (!Helper.isInputFocused()) {
				Globals.globalEventsService.toggleVisibility.next();
			}
		};
		this.addKeybinding({event: 'up', fun: visible, emitter: this.visibilityKey});
	}
	
	private setLayerAlpha() {
		const map = Globals.map;
		if (map) {
			map.layers.forEach(layer => {
				layer.alpha = this.renderLayersTransparent ? 0.5 : 1;
			});
			if (this.layer) {
				this.layer.alpha = 1;
			}
		}
	}
	
	private onMouseRightDown() {
		this.rightPointerDown = true;
		if (!this.layer) {
			return;
		}
		
		
		// only start tile copy when cursor in bounds
		const pointer = this.scene.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX - this.layer.x, pointer.worldY - this.layer.y);
		if (!Helper.isInBounds(this.layer, p)) {
			return;
		}
		
		this.resetSelectedTiles();
		this.renderPreview();
		this.rightClickStart = p;
	}
	
	private drawRect(width: number, height: number, x = 0, y = 0) {
		if (this.rect) {
			this.rect.destroy();
		}
		this.rect = this.scene.add.rectangle(x, y, width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
		this.rect.setOrigin(0, 0);
		this.rect.setStrokeStyle(1, 0xffffff, 0.6);
		
		this.container.add(this.rect);
	}
	
	private onMouseRightUp() {
		this.rightPointerDown = false;
		if (!this.layer) {
			return;
		}
		this.selectedTiles = [];
		
		// cancel current selection when out of bounds
		const phaserLayer = this.layer.getPhaserLayer();
		if (!this.rightClickStart || !this.rightClickEnd || !phaserLayer) {
			this.drawRect(1, 1);
			this.resetSelectedTiles();
			this.renderPreview();
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
		
		const tilesWithin = phaserLayer.getTilesWithin(smaller.x, smaller.y, width, height);
		
		tilesWithin.forEach((tile: Phaser.Tilemaps.Tile) => {
			this.selectedTiles.push({
				id: tile.index,
				offset: Vec2.sub(tile, smaller, true)
			});
		});
		
		this.renderPreview();
		
		this.drawRect(width, height);
		
		
		this.rightClickStart = undefined;
		this.rightClickEnd = undefined;
	}
	
	private renderPreview() {
		
		// reset last draw when selected tiles change
		this.lastDraw.x = -1;
		this.previewTileMap.removeAllLayers();
		const layer = this.previewTileMap.createBlankLayer('layer', 'only', 0, 0, 40, 40)!;
		
		this.selectedTiles.forEach(tile => {
			customPutTileAt(tile.id, tile.offset.x, tile.offset.y, layer.layer);
		});
		
		this.previewLayer = layer;
		this.previewLayer.depth = this.container.depth - 1;
		this.previewLayer.alpha = 0.6;
		
		// TODO: phaser bug fix, see https://github.com/photonstorm/phaser/issues/4642
		this.previewTileMap.layers = [this.previewLayer.layer];
	}
	
	private resetSelectedTiles() {
		this.selectedTiles = [{id: 0, offset: {x: 0, y: 0}}];
	}
	
	private fill() {
		if (!this.layer) {
			return;
		}
		
		const pointer = this.scene.input.activePointer;
		const p = Helper.worldToTile(pointer.worldX - this.layer.x, pointer.worldY - this.layer.y);
		
		if (this.selectedTiles.length > 0) {
			Filler.fill(this.layer, this.selectedTiles[0].id, p);
			Globals.stateHistoryService.saveState({
				name: 'fill',
				icon: 'format_color_fill'
			});
		}
		
	}
}
