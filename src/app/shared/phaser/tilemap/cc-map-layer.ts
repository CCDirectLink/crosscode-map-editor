import {MapLayer, Point} from '../../interfaces/cross-code-map';
import * as Phaser from 'phaser-ce';
import {Sortable} from '../../interfaces/sortable';
import {Helper} from '../helper';

export class CCMapLayer extends Phaser.Image implements Sortable {

	private bitmap: Phaser.BitmapData;
	private tilesetImage: Phaser.Image;
	private tileCrop: Phaser.Rectangle;
	private tilesetSize: Point;
	zIndex: number;

	constructor(game: Phaser.Game,
				public details: MapLayer) {
		super(game, 0, 0, '');
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
		// TODO: bitmaps should be destroyed too, but when i try i get some cors errors
		this.tilesetImage.destroy();
		super.destroy();
	}
}
