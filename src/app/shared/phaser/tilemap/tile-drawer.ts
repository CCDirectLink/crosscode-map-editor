import {CCMapLayer} from './cc-map-layer';
import {Globals} from '../../globals';
import {SortableGroup} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {MapLayer, Point} from '../../interfaces/cross-code-map';
import {Vec2} from '../vec2';

export class TileDrawer extends Phaser.Plugin {

	private layer: CCMapLayer;
	private selectedTiles: {
		tiles: {
			id: number;
			offset: Point
		}[],
		img: Phaser.Image,
		tilesetSize: Point,
		bitmap: Phaser.BitmapData,
		imgName: string
	};
	private showTilemap: Phaser.Key;
	private graphics: Phaser.Graphics;
	private group: SortableGroup;
	private tilesetImg: Phaser.Image;
	private tileSelectMap: CCMapLayer;

	private rightClickStart: Point;
	private rightClickEnd: Point;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.hasRender = true;
		this.showTilemap = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.group = game.add.group();

		// needs custom property because z gets reset to the index after a sort is done
		this.group.zIndex = 1000;

		this.graphics = game.add.graphics(0, 0);
		this.setDefaultStyle();
		this.graphics.drawRect(0, 0, Globals.tileSize, Globals.tileSize);

		this.selectedTiles = <any>{};
		this.selectedTiles.tiles = [];

		this.selectedTiles.bitmap = game.make.bitmapData(30 * Globals.tileSize, 30 * Globals.tileSize, 'tileDrawer');
		this.selectedTiles.img = game.make.image(0, 0);
		this.selectedTiles.img.loadTexture(this.selectedTiles.bitmap);
		this.selectedTiles.img.alpha = 0.5;

		this.group.add(this.graphics);
		this.group.add(this.selectedTiles.img);

		game.input.mousePointer.rightButton.onDown.add(() => this.onMouseRightDown());
		game.input.mousePointer.rightButton.onUp.add(() => this.onMouseRightUp());
		this.showTilemap.onDown.add(() => this.toggleTileSelectorMap());

	}

	selectLayer(selectedLayer: CCMapLayer) {
		this.layer = selectedLayer;
		if (!selectedLayer) {
			return;
		}
		this.tilesetImg = this.game.make.image(0, 0, selectedLayer.details.tilesetName);
		this.tilesetImg.crop(new Phaser.Rectangle(0, 0, Globals.tileSize * 10, Globals.tileSize * 10));
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
		details.tilesize = Globals.tileSize;
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

	update() {
		const graphics = this.graphics;
		const game = this.game;
		graphics.visible = true;
		const p = Helper.screenToTile(game, game.input.mousePointer.x, game.input.mousePointer.y);

		// hide cursor when no map loaded
		if (!this.layer) {
			graphics.visible = false;
			return;
		}

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
				start.x = Globals.tileSize;
				diff.x--;
			}
			if (diff.y >= 0) {
				diff.y++;
			} else {
				start.y = Globals.tileSize;
				diff.y--;
			}

			this.graphics.drawRect(
				start.x,
				start.y,
				diff.x * Globals.tileSize,
				diff.y * Globals.tileSize);
			return;
		}

		// position tile drawer border to cursor
		graphics.x = p.x * Globals.tileSize;
		graphics.y = p.y * Globals.tileSize;
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
					this.layer.details.data[finalPos.y][finalPos.x] = tile.id;
				}
			});
			this.layer.renderAll();
		}
	}

	toggleTileSelectorMap() {
		const game = this.game;

		this.tileSelectMap.visible = !this.tileSelectMap.visible;

		if (this.tileSelectMap.visible) {
			const p2 = Helper.screenToTile(game, 0, 0);
			Vec2.addC(p2, 1, 1);
			Vec2.assign(this.tileSelectMap, p2);
			Vec2.mulF(this.tileSelectMap, Globals.tileSize);
		}
	}

	onMouseRightDown() {
		if (!this.layer) {
			return;
		}

		// only start tile copy when cursor in bounds
		const p = Helper.screenToTile(this.game, this.game.input.mousePointer.x, this.game.input.mousePointer.y);
		if (!this.isInBounds(this.tileSelectMap.visible ? this.tileSelectMap : this.layer, p)) {
			return;
		}
		this.rightClickStart = p;
	}

	onMouseRightUp() {
		if (!this.layer) {
			return;
		}
		this.selectedTiles.tiles = [];
		this.graphics.clear();
		this.setDefaultStyle();

		// cancel current selection when out of bounds
		if (!this.rightClickStart) {
			this.graphics.drawRect(0, 0, Globals.tileSize, Globals.tileSize);
			this.selectedTiles.tiles.push({id: 0, offset: {x: 0, y: 0}});
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
			Vec2.divC(offset, Globals.tileSize);
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
					offset: {x: x - smaller.x, y: y - smaller.y}
				});
			}
		}

		this.renderPreview(data, smaller);
		this.graphics.drawRect(
			0,
			0,
			(bigger.x + 1 - smaller.x) * Globals.tileSize,
			(bigger.y + 1 - smaller.y) * Globals.tileSize);


		this.rightClickStart = null;
		this.rightClickEnd = null;
	}

	renderPreview(data: number[][], offset: Point) {
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
			this.tilesetImg.cropRect.x = pos.x * Globals.tileSize;
			this.tilesetImg.cropRect.y = pos.y * Globals.tileSize;
			this.tilesetImg.cropRect.width = Globals.tileSize;
			this.tilesetImg.cropRect.height = Globals.tileSize;
			this.tilesetImg.updateCrop();
			bitmap.draw(
				this.tilesetImg,
				tile.offset.x * Globals.tileSize,
				tile.offset.y * Globals.tileSize,
				Globals.tileSize, Globals.tileSize
			);

		});
	}

	setDefaultStyle() {
		this.graphics.lineStyle(1, 0xFFFFFF, 0.7);
	}

	isInBounds(layer: CCMapLayer, p: Point): boolean {
		const offset = Vec2.create(layer);
		Vec2.divC(offset, Globals.tileSize);
		return p.x >= offset.x && p.y >= offset.y && p.x < layer.details.width + offset.x && p.y < layer.details.height + offset.y;
	}

	clampToBounds(layer: CCMapLayer, p: Point) {
		const offset = Vec2.create(layer);
		Vec2.divC(offset, Globals.tileSize);
		p.x = Helper.clamp(p.x, offset.x, layer.details.width - 1 + offset.x);
		p.y = Helper.clamp(p.y, offset.y, layer.details.height - 1 + offset.y);
	}

}
