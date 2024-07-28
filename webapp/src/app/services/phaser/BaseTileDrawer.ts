import { SelectedTile } from '../../models/tile-selector';
import { Point } from '../../models/cross-code-map';
import { Helper } from './helper';
import { BaseObject } from './base-object';
import * as Phaser from 'phaser';
import { CCMapLayer } from './tilemap/cc-map-layer';
import { Globals } from '../globals';
import { Vec2 } from './vec2';
import { customPutTileAt } from './tilemap/layer-helper';

export class BaseTileDrawer extends BaseObject {
	private selectedTiles: SelectedTile[] = [];
	private rightPointerDown = false;
	private rightClickStart?: Point;
	private rightClickEnd?: Point;
	
	private selection?: Phaser.GameObjects.Container;
	
	private previewTileMap!: Phaser.Tilemaps.Tilemap;
	private previewLayer?: Phaser.Tilemaps.TilemapLayer;
	
	private layer?: CCMapLayer;
	
	/**
	 * @param scene
	 * @param leftClick
	 * @param container container is used to follow mouse movements and render preview
	 */
	constructor(
		scene: Phaser.Scene,
		private leftClick?: boolean,
		private container?: Phaser.GameObjects.Container
	) {
		super(scene, 'baseTileDrawer');
	}
	
	protected override init(): void {
		this.previewTileMap = this.scene.add.tilemap(undefined, Globals.TILE_SIZE, Globals.TILE_SIZE);
	}
	
	preUpdate(): void {
		if (!this.layer) {
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
				start.x = 1;
				diff.x--;
			}
			if (diff.y >= 0) {
				diff.y++;
			} else {
				start.y = 1;
				diff.y--;
			}
			
			if (!this.container) {
				Vec2.add(start, this.rightClickStart);
			}
			this.drawRect(diff.x, diff.y, start.x * Globals.TILE_SIZE, start.y * Globals.TILE_SIZE, true);
			return;
		}
		
		
		// position tile drawer border to cursor
		if (this.container) {
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
		}
	}
	
	protected override activate(): void {
		this.setVisibility(true);
		const pointerDown = (pointer: Phaser.Input.Pointer) => {
			if (pointer.rightButtonDown() || this.leftClick && pointer.leftButtonDown()) {
				this.onMouseRightDown();
			}
		};
		
		const pointerUp = (pointer: Phaser.Input.Pointer) => {
			if ((pointer.rightButtonReleased() || this.leftClick && pointer.leftButtonReleased()) && this.rightPointerDown) {
				this.onMouseRightUp();
			}
		};
		this.addKeybinding({event: 'pointerdown', fun: pointerDown, emitter: this.scene.input});
		this.addKeybinding({event: 'pointerup', fun: pointerUp, emitter: this.scene.input});
		this.addKeybinding({event: 'pointerupoutside', fun: pointerUp, emitter: this.scene.input});
		
		this.addSubscription(Globals.phaserEventsService.changeSelectedTiles.subscribe(tiles => this.updateSelectedTiles(tiles)));
	}
	
	protected override deactivate(): void {
		this.setVisibility(false);
	}
	
	private setVisibility(visible: boolean) {
		visible = visible && !!this.layer;
		this.selection?.setVisible(visible);
		this.previewLayer?.setVisible(visible);
	}
	
	public async setLayer(layer?: CCMapLayer) {
		this.layer = layer;
		if (!layer) {
			this.setVisibility(false);
			return;
		}
		
		const exists = await Helper.loadTexture(layer.details.tilesetName, this.scene);
		if (!exists) {
			this.setVisibility(false);
			return;
		}
		this.setVisibility(true);
		
		const tileset = this.previewTileMap.addTilesetImage('only', layer.details.tilesetName);
		if (tileset) {
			tileset.firstgid = 1;
		}
		
	}
	
	public resetSelectedTiles() {
		Globals.phaserEventsService.changeSelectedTiles.next([{id: 0, offset: {x: 0, y: 0}}]);
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
		this.rightClickStart = p;
	}
	
	private onMouseRightUp() {
		this.rightPointerDown = false;
		if (!this.layer) {
			return;
		}
		
		// cancel current selection when out of bounds
		const phaserLayer = this.layer.getPhaserLayer();
		if (!this.rightClickStart || !this.rightClickEnd || !phaserLayer) {
			this.resetSelectedTiles();
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
		
		const tiles: SelectedTile[] = tilesWithin.map(tile => ({
			id: tile.index,
			offset: Vec2.sub(tile, smaller, true)
		}));
		Globals.phaserEventsService.changeSelectedTiles.next(tiles);
		
		this.rightClickStart = undefined;
		this.rightClickEnd = undefined;
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
		
		if (this.container) {
			this.drawRect(x + 1, y + 1, 0, 0);
			return;
		}
	}
	
	public drawRect(width: number, height: number, x = 0, y = 0, renderSize = false) {
		if (this.selection) {
			this.selection.destroy();
		}
		
		let textColor = 'rgba(0,0,0,0.6)';
		let backgroundColor = 0xffffff;
		if (Globals.settingsService.getSettings().selectionBoxDark) {
			textColor = 'rgba(255,255,255,0.9)';
			backgroundColor = 0x333333;
		}
		
		this.selection = this.scene.add.container(x, y);
		
		const rect = this.scene.add.rectangle(0, 0, width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
		rect.setOrigin(0, 0);
		rect.setStrokeStyle(1, backgroundColor, this.container ? 0.6 : 0.9);
		
		this.selection.add(rect);
		this.container?.add(this.selection);
		
		if (!renderSize) {
			Globals.globalEventsService.updateTileSelectionSize.next(undefined);
			return;
		}
		
		const makeText = (pos: Point, val: number) => {
			const text = this.scene.add.text(pos.x, pos.y, Math.abs(val) + '', {
				font: '400 10px Roboto',
				color: textColor,
				resolution: window.devicePixelRatio * 3,
			});
			text.setOrigin(0.5, 0);
			const background = this.scene.add.rectangle(pos.x, pos.y + 2, 14, 10, backgroundColor, 0.6);
			background.setOrigin(0.5, 0);
			
			this.selection?.add(background);
			this.selection?.add(text);
		};
		
		if (Math.abs(width) >= 3) {
			makeText({
				x: width * Globals.TILE_SIZE / 2,
				y: (height > 0 ? 0 : height * Globals.TILE_SIZE) - 1
			}, width);
		}
		
		if (Math.abs(height) >= 3) {
			makeText({
				x: Globals.TILE_SIZE / 2 + (width > 0 ? 0 : width * Globals.TILE_SIZE),
				y: (height - 1) * Globals.TILE_SIZE / 2,
			}, height);
		}
		
		Globals.globalEventsService.updateTileSelectionSize.next({
			x: Math.abs(width),
			y: Math.abs(height)
		});
	}
	
	private renderPreview() {
		if (!this.container) {
			return;
		}
		this.previewTileMap.removeAllLayers();
		const layer = this.previewTileMap.createBlankLayer('layer', 'only', 0, 0, 40, 40)!;
		
		this.selectedTiles.forEach(tile => {
			customPutTileAt(tile.id, tile.offset.x, tile.offset.y, layer.layer);
		});
		
		this.previewLayer = layer;
		this.previewLayer.depth = this.container.depth - 1;
		this.previewLayer.alpha = 0.6;
	}
}
