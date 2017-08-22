import {MapLayer, Point} from '../../interfaces/cross-code-map';
import * as Phaser from 'phaser-ce';

export class CCMapLayer extends Phaser.Image {

	private bitmap: Phaser.BitmapData;
	private tilesetImage: Phaser.Image;
	private tileCrop: Phaser.Rectangle;
	private tilesetSize: Phaser.Point;

	constructor(game: Phaser.Game,
				public details: MapLayer) {
		super(game, 0, 0, '');
		this.details.level = parseInt(<any>this.details.level, 10);
		this.details.distance = parseFloat(<any>this.details.distance);
		this.bitmap = game.make.bitmapData(details.width * details.tilesize, details.height * details.tilesize, details.name);
		this.loadTexture(this.bitmap);
		game.add.existing(this);

		this.tilesetImage = game.make.image(0, 0, details.tilesetName);
		const img = game.cache.getImage(details.tilesetName);
		this.tilesetSize = new Phaser.Point(img.width, img.height);
		this.tilesetSize.divide(details.tilesize, details.tilesize);

		this.tileCrop = new Phaser.Rectangle(0, 0, details.tilesize, details.tilesize);
		this.tilesetImage.crop(this.tileCrop);

		const skip = 'Navigation Collision'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});

		// this.visible = false;
		this.render();
	}

	render() {
		const bitmap = this.bitmap;
		const tileset = this.tilesetImage;
		const details = this.details;
		const tileSize = details.tilesize;

		for (let y = 0; y < details.data.length; y++) {
			for (let x = 0; x < details.data[y].length; x++) {
				this.makeTile(details.data[y][x]);
				bitmap.draw(tileset, x * tileSize, y * tileSize, tileSize, tileSize);
			}
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

		crop.x = index % this.tilesetSize.x;
		crop.y = Math.floor(index / this.tilesetSize.x);

		if (crop.x === 0) {
			crop.x = this.tilesetSize.x;
			crop.y--;
		}
		crop.x--;

		crop.x *= tilesize;
		crop.y *= tilesize;

		tileset.updateCrop();
	}

	destroy() {
		this.bitmap.destroy();
		this.tilesetImage.destroy();
		super.destroy();
	}
}
