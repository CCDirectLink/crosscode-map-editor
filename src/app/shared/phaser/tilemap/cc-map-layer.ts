import {MapLayer, Point} from '../../interfaces/cross-code-map';
import * as Phaser from 'phaser-ce';
import {Sortable} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {Globals} from '../../globals';

export class CCMapLayer extends Phaser.Image implements Sortable {

	public details: MapLayer;
	public backgroundColor: { r: number, g: number, b: number, a: number };

	private bitmap: Phaser.BitmapData;
	private tilesetImage: Phaser.Image;
	private tileCrop: Phaser.Rectangle;
	private tilesetSize: Point;
	zIndex: number;

	constructor(game: Phaser.Game, details: MapLayer) {
		super(game, 0, 0, '');
		this.details = details;
		this.details.level = parseInt(<any>this.details.level, 10);
		this.details.distance = parseFloat(<any>this.details.distance);
		this.bitmap = game.make.bitmapData(details.width * details.tilesize, details.height * details.tilesize);
		this.loadTexture(this.bitmap);
		game.add.existing(this);

		this.tilesetImage = game.make.image(0, 0, details.tilesetName);
		this.tilesetSize = Helper.getTilesetSize(game.cache.getImage(details.tilesetName));

		this.tileCrop = new Phaser.Rectangle(0, 0, details.tilesize, details.tilesize);
		this.tilesetImage.crop(this.tileCrop);

		const skip = 'Navigation Collision'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});

		this.zIndex = this.details.level;
		if (isNaN(this.zIndex)) {
			// this.zIndex = 0;
		}
		// this.visible = false;
		this.renderAll();
	}

	renderAll() {
		console.log('renderAlll');
		const bitmap = this.bitmap;
		const tileset = this.tilesetImage;
		const details = this.details;
		const tileSize = details.tilesize;

		bitmap.clear();
		if (this.backgroundColor) {
			const bg = this.backgroundColor;
			bitmap.fill(bg.r, bg.g, bg.b, bg.a);
		}

		for (let y = 0; y < details.data.length; y++) {
			for (let x = 0; x < details.data[y].length; x++) {
				const tile = details.data[y][x];
				if (tile === 0) {
					continue;
				}
				this.makeTile(tile);
				bitmap.draw(tileset, x * tileSize, y * tileSize, tileSize, tileSize);
			}
		}
	}

	makeTile(index: number) {
		const tileset = this.tilesetImage;
		const tilesize = this.details.tilesize;
		const crop = this.tileCrop;

		const p = Helper.getTilePos(this.tilesetSize, index);

		crop.x = p.x * tilesize;
		crop.y = p.y * tilesize;

		tileset.updateCrop();
	}

	destroy() {
		this.bitmap.destroy();
		this.tilesetImage.destroy();
		super.destroy();
	}

	resize(width: number, height: number) {
		const data = this.details.data;
		data.length = height;
		for (let i = 0; i < data.length; i++) {
			if (!data[i]) {
				data[i] = new Array(width).fill(0);
			} else {
				if (width < this.details.width) {
					data[i].length = width;
				} else {
					while (data[i].length < width) {
						data[i].push(0);
					}
				}
			}
		}

		this.details.width = width;
		this.details.height = height;

		this.bitmap.resize(width * Globals.tileSize, height * Globals.tileSize);

		this.renderAll();
	}
}
