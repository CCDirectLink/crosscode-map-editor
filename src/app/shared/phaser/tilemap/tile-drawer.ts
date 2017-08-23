import {CCMapLayer} from './cc-map-layer';
import {Globals} from '../../globals';
import {SortableGroup} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {Point} from '../../interfaces/cross-code-map';
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

		game.input.mousePointer.rightButton.onDown.add(() => {
			if (!this.layer) {
				return;
			}

			// only start tile copy when cursor in bounds
			const p = Helper.screenToTile(game, game.input.mousePointer.x, game.input.mousePointer.y);
			if (!this.isInBounds(this.layer, p)) {
				return;
			}
			this.rightClickStart = p;
		});

		game.input.mousePointer.rightButton.onUp.add(() => {
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

			for (let x = smaller.x; x <= bigger.x; x++) {
				for (let y = smaller.y; y <= bigger.y; y++) {
					this.selectedTiles.tiles.push({
						id: this.layer.details.data[y][x],
						offset: {x: x - smaller.x, y: y - smaller.y}
					});
				}
			}

			this.renderPreview(smaller);
			this.graphics.drawRect(
				0,
				0,
				(bigger.x + 1 - smaller.x) * Globals.tileSize,
				(bigger.y + 1 - smaller.y) * Globals.tileSize);


			this.rightClickStart = null;
			this.rightClickEnd = null;
		});
	}

	selectLayer(selectedLayer: CCMapLayer) {
		this.layer = selectedLayer;
		if (!selectedLayer) {
			return;
		}
		this.tilesetImg = this.game.make.image(0, 0, selectedLayer.details.tilesetName);
		this.tilesetImg.crop(new Phaser.Rectangle(0, 0, Globals.tileSize * 10, Globals.tileSize * 10));
		this.selectedTiles.tilesetSize = Helper.getTilesetSize(this.game.cache.getImage(selectedLayer.details.tilesetName));
	}

	update() {
		const graphics = this.graphics;
		const game = this.game;
		graphics.visible = true;
		const p = Helper.screenToTile(game, game.input.mousePointer.x, game.input.mousePointer.y);

		if (!this.layer) {
			// hide cursor when no map loaded
			graphics.visible = false;
			return;
		}

		if (this.rightClickStart) {
			// render selection border
			this.graphics.clear();
			this.setDefaultStyle();
			this.clampToBounds(this.layer, p);
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

		if (game.input.mousePointer.leftButton.isDown) {
			// draw tile
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

	renderPreview(offset) {
		const tiles = this.selectedTiles;
		const bitmap = tiles.bitmap;

		bitmap.clear();
		tiles.tiles.forEach(tile => {
			const finalPos = Vec2.add(tile.offset, offset, true);
			const id = this.layer.details.data[finalPos.y][finalPos.x];
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
		return p.x >= 0 && p.y >= 0 && p.x < layer.details.width && p.y < layer.details.height;
	}

	clampToBounds(layer: CCMapLayer, p: Point) {
		p.x = Helper.clamp(p.x, 0, layer.details.width - 1);
		p.y = Helper.clamp(p.y, 0, layer.details.height - 1);
	}

}
