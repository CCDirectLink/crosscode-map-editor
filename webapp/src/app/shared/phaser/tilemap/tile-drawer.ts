import {CCMapLayer} from './cc-map-layer';
import {Globals} from '../../globals';
import {SortableGroup} from '../../../models/sortable';
import {Helper} from '../helper';
import {MapLayer, Point} from '../../../models/cross-code-map';
import {Vec2} from '../vec2';
import {CCMap} from './cc-map';
import {MapLoaderService} from '../../map-loader.service';
import {HistoryState, StateHistoryService} from '../../history/state-history.service';
import {GlobalEventsService} from '../../global-events.service';
import { ISelectedTiles } from '../../../models/tile-selector';
import * as Phaser from 'phaser-ce';

export class TileDrawer extends Phaser.Plugin {
	
	private layer: CCMapLayer;
	private selectedTiles: {
		tiles: {
			id: number;
			offset: Phaser.Point
		}[],
		size: Phaser.Point,
		img: Phaser.Image,
		tilesetSize: Point,
		bitmap: Phaser.BitmapData,
		imgName: string
	};
	private toggleTilemapKey: Phaser.Key;
	private graphics: Phaser.Graphics;
	private group: SortableGroup;
	private tilesetImg: Phaser.Image;
	private tileSelectMap: CCMapLayer;
	private keyBindings: Phaser.SignalBinding[] = [];
	
	private rightClickStart: Point;
	private rightClickEnd: Point;
	
	private renderLayersTransparent = false;
	private transparentKey: Phaser.Key;
	private visibilityKey: Phaser.Key;
	private fillKey: Phaser.Key;
	private map: CCMap;
	
	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.toggleTilemapKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fillKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
		this.transparentKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.visibilityKey = game.input.keyboard.addKey(Phaser.Keyboard.V);
		
		this.game.input.keyboard.removeKeyCapture(this.toggleTilemapKey.keyCode);
		this.game.input.keyboard.removeKeyCapture(this.fillKey.keyCode);
		this.game.input.keyboard.removeKeyCapture(this.transparentKey.keyCode);
		
		this.group = game.add.group();
		
		// needs custom property because z gets reset to the index after a sort is done
		this.group.zIndex = 1000;
		
		this.graphics = game.add.graphics(0, 0);
		this.setDefaultStyle();
		this.graphics.drawRect(0, 0, Globals.TILE_SIZE, Globals.TILE_SIZE);
		
		this.selectedTiles = <any>{};
		this.selectedTiles.tiles = [];
		
		this.selectedTiles.bitmap = game.make.bitmapData(30 * Globals.TILE_SIZE, 30 * Globals.TILE_SIZE, 'tileDrawer');
		this.selectedTiles.img = game.make.image(0, 0);
		this.selectedTiles.img.loadTexture(this.selectedTiles.bitmap);
		this.selectedTiles.img.alpha = 0.5;
		
		this.group.add(this.graphics);
		this.group.add(this.selectedTiles.img);
	}
	
	selectLayer(selectedLayer: CCMapLayer, map?: CCMap) {
		this.layer = selectedLayer;
		this.map = map || this.map;
		
		this.setLayerAlpha();
		
		// hide when no layer selected or has no tileset
		if (!selectedLayer || !selectedLayer.details.tilesetName) {
			this.group.visible = false;
			return;
		}
		Globals.zIndexUpdate = true;
		this.group.visible = true;
		this.tilesetImg = this.game.make.image(0, 0, selectedLayer.details.tilesetName);
		this.tilesetImg.crop(new Phaser.Rectangle(0, 0, Globals.TILE_SIZE * 10, Globals.TILE_SIZE * 10));
		const tilesetSize = Helper.getTilesetSize(this.game.cache.getImage(selectedLayer.details.tilesetName));
		this.selectedTiles.tilesetSize = tilesetSize;
		
		// create tileset selector map
		if (this.tileSelectMap) {
			this.tileSelectMap.destroy();
			this.group.remove(this.tileSelectMap);
		}
		
		const details: MapLayer = <MapLayer>{};
		details.width = tilesetSize.x;
		details.height = tilesetSize.y;
		details.tilesetName = selectedLayer.details.tilesetName;
		details.tilesize = Globals.TILE_SIZE;
		details.data = new Array(details.height);
		
		let counter = 1;
		
		for (let y = 0; y < details.height; y++) {
			details.data[y] = [];
			for (let x = 0; x < details.width; x++) {
				details.data[y][x] = counter;
				counter++;
			}
		}
		
		this.tileSelectMap = new CCMapLayer(this.game, details);
		this.tileSelectMap.backgroundColor = {r: 255, g: 128, b: 0, a: 1};
		
		this.tileSelectMap.renderAll();
		this.tileSelectMap.visible = false;
		
		this.group.add(this.tileSelectMap, false, 0);
	}

	public select(selected: ISelectedTiles) {
		this.selectedTiles.tiles = selected.tiles;
		this.selectedTiles.size = selected.size;
		this.renderPreviewById();
	}
	
	
	update() {
		const graphics = this.graphics;
		const game = this.game;
		graphics.visible = true;
		
		// hide cursor when no map loaded
		if (!this.layer) {
			graphics.visible = false;
			return;
		}
		const p = Helper.screenToTile(game.input.mousePointer);
		
		// render selection border
		if (this.rightClickStart) {
			this.graphics.clear();
			this.setDefaultStyle();
			this.clampToBounds(this.tileSelectMap.visible ? this.tileSelectMap : this.layer, p);
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
			
			this.graphics.drawRect(
				start.x,
				start.y,
				diff.x * Globals.TILE_SIZE,
				diff.y * Globals.TILE_SIZE);
			return;
		}
		
		// position tile drawer border to cursor
		graphics.x = p.x * Globals.TILE_SIZE;
		graphics.y = p.y * Globals.TILE_SIZE;
		this.selectedTiles.img.x = graphics.x;
		this.selectedTiles.img.y = graphics.y;
		
		// draw tiles (skip when tile selector is open)
		if (game.input.mousePointer.leftButton.isDown && !this.tileSelectMap.visible) {
			this.selectedTiles.tiles.forEach(tile => {
				const finalPos = {
					x: p.x + tile.offset.x,
					y: p.y + tile.offset.y
				};
				if (this.isInBounds(this.layer, finalPos)) {
					this.layer.drawTile(finalPos.x, finalPos.y, tile.id);
				}
			});
		}
	}
	
	deactivate() {
		this.keyBindings.forEach(binding => binding.detach());
		this.keyBindings = [];
	}
	
	activate() {
		this.keyBindings.push(this.game.input.mousePointer.leftButton.onUp.add(() => {
			if (!this.layer) {
				return;
			}
			const stateHistory = <StateHistoryService>this.game['StateHistoryService'];
			
			stateHistory.saveState({
				name: 'Tile Drawer',
				icon: 'create',
			});
		}));
		this.keyBindings.push(this.game.input.mousePointer.rightButton.onDown.add(() => this.onMouseRightDown()));
		this.keyBindings.push(this.game.input.mousePointer.rightButton.onUp.add(() => this.onMouseRightUp()));
		this.keyBindings.push(this.toggleTilemapKey.onDown.add(() => {
			if (!Helper.isInputFocused()) {
				this.toggleTileSelectorMap();
			}
		}));
		this.keyBindings.push(this.fillKey.onDown.add(() => {
			if (!Helper.isInputFocused()) {
				this.fill();
			}
		}));
		this.keyBindings.push(this.transparentKey.onDown.add(() => {
			if (!Helper.isInputFocused()) {
				this.renderLayersTransparent = !this.renderLayersTransparent;
				this.setLayerAlpha();
			}
		}));
		this.keyBindings.push(this.visibilityKey.onDown.add(() => {
			if (!Helper.isInputFocused()) {
				const events: GlobalEventsService = this.game['GlobalEventsService'];
				events.toggleVisibility.next();
			}
		}));
	}
	
	private setLayerAlpha() {
		if (this.map) {
			this.map.layers.forEach(layer => {
				layer.alpha = this.renderLayersTransparent ? 0.5 : 1;
			});
			if (this.layer) {
				this.layer.alpha = 1;
			}
		}
	}
	
	private toggleTileSelectorMap() {
		const game = this.game;
		if (!this.layer) {
			this.tileSelectMap.visible = false;
			return;
		}
		
		this.tileSelectMap.visible = !this.tileSelectMap.visible;
		
		if (this.tileSelectMap.visible) {
			const p2 = Helper.screenToTile(0, 0);
			Vec2.addC(p2, 1, 1);
			Vec2.assign(this.tileSelectMap, p2);
			Vec2.mulF(this.tileSelectMap, Globals.TILE_SIZE);
		}
	}
	
	private onMouseRightDown() {
		if (!this.layer) {
			return;
		}
		
		// only start tile copy when cursor in bounds
		const p = Helper.screenToTile(this.game.input.mousePointer);
		if (!this.isInBounds(this.tileSelectMap.visible ? this.tileSelectMap : this.layer, p)) {
			return;
		}
		this.rightClickStart = p;
	}
	
	private onMouseRightUp() {
		if (!this.layer) {
			return;
		}
		this.selectedTiles.tiles = [];
		this.graphics.clear();
		this.setDefaultStyle();
		
		// cancel current selection when out of bounds
		if (!this.rightClickStart) {
			this.graphics.drawRect(0, 0, Globals.TILE_SIZE, Globals.TILE_SIZE);
			this.selectedTiles.tiles.push({id: 0, offset: new Phaser.Point(0, 0)});
			this.selectedTiles.bitmap.clear();
			return;
		}
		
		// select tiles
		const start = this.rightClickStart;
		const end = this.rightClickEnd;
		
		let data = this.layer.details.data;
		if (this.tileSelectMap.visible) {
			data = this.tileSelectMap.details.data;
			const offset = Vec2.create(this.tileSelectMap);
			Vec2.divC(offset, Globals.TILE_SIZE);
			Vec2.sub(start, offset);
			Vec2.sub(end, offset);
		}
		
		
		const smaller = {
			x: Math.min(start.x, end.x),
			y: Math.min(start.y, end.y)
		};
		
		const bigger = {
			x: Math.max(start.x, end.x),
			y: Math.max(start.y, end.y)
		};
		
		for (let x = smaller.x; x <= bigger.x; x++) {
			for (let y = smaller.y; y <= bigger.y; y++) {
				this.selectedTiles.tiles.push({
					id: data[y][x],
					offset: new Phaser.Point(x - smaller.x, y - smaller.y)
				});
				// console.log('pos', {x: x, y: y});
			}
		}
		console.log(this.selectedTiles.tiles[0].id);
		
		this.renderPreview(data, smaller);
		this.graphics.drawRect(
			0,
			0,
			(bigger.x + 1 - smaller.x) * Globals.TILE_SIZE,
			(bigger.y + 1 - smaller.y) * Globals.TILE_SIZE);
		
		
		this.rightClickStart = null;
		this.rightClickEnd = null;
	}
	
	private renderPreview(data: number[][], offset: Point) {
		const tiles = this.selectedTiles;
		const bitmap = tiles.bitmap;
		
		bitmap.clear();
		tiles.tiles.forEach(tile => {
			const finalPos = Vec2.add(tile.offset, offset, true);
			const id = data[finalPos.y][finalPos.x];
			const pos = Helper.getTilePos(tiles.tilesetSize, id);
			if (id === 0) {
				return;
			}

			this.renderPreviewTile(pos, tile.offset);
		});
	}
	
	private renderPreviewById() {
		const tiles = this.selectedTiles;
		const bitmap = tiles.bitmap;

		this.graphics.clear();
		this.setDefaultStyle();
		this.graphics.drawRect(0, 0, tiles.size.x * Globals.TILE_SIZE, tiles.size.y * Globals.TILE_SIZE);
		
		bitmap.clear();
		for (const tile of tiles.tiles) {
			const pos = Helper.getTilePos(tiles.tilesetSize, tile.id);
			if (tile.id === 0) {
				return;
			}

			this.renderPreviewTile(pos, tile.offset);
		}
	}

	private renderPreviewTile(pos: Point, offset: Point) {
		const bitmap = this.selectedTiles.bitmap;

		this.tilesetImg.cropRect.x = pos.x * Globals.TILE_SIZE;
		this.tilesetImg.cropRect.y = pos.y * Globals.TILE_SIZE;
		this.tilesetImg.cropRect.width = Globals.TILE_SIZE;
		this.tilesetImg.cropRect.height = Globals.TILE_SIZE;
		this.tilesetImg.updateCrop();
		bitmap.draw(
			this.tilesetImg,
			offset.x * Globals.TILE_SIZE,
			offset.y * Globals.TILE_SIZE,
			Globals.TILE_SIZE, Globals.TILE_SIZE
		);

	}
	
	private setDefaultStyle() {
		this.graphics.lineStyle(1, 0xFFFFFF, 0.7);
	}
	
	private isInBounds(layer: CCMapLayer, p: Point): boolean {
		const offset = Vec2.create(layer);
		Vec2.divC(offset, Globals.TILE_SIZE);
		return p.x >= offset.x && p.y >= offset.y && p.x < layer.details.width + offset.x && p.y < layer.details.height + offset.y;
	}
	
	private clampToBounds(layer: CCMapLayer, p: Point) {
		const offset = Vec2.create(layer);
		Vec2.divC(offset, Globals.TILE_SIZE);
		p.x = Helper.clamp(p.x, offset.x, layer.details.width - 1 + offset.x);
		p.y = Helper.clamp(p.y, offset.y, layer.details.height - 1 + offset.y);
	}
	
	private fill() {
		if (!this.layer || this.tileSelectMap.visible) {
			return;
		}
		const game = this.game;
		
		const p = Helper.screenToTile(game.input.mousePointer);
		if (this.selectedTiles.tiles.length > 0) {
			this.layer.fill(this.selectedTiles.tiles[0].id, p);
		}
	}
}
