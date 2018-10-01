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
		if (typeof details.level === 'string') {
			// possible levels
			// 'first'
			// 'last'
			// 'light'
			// 'postlight'
			// 'object1'
			// 'object2'
			// 'object3'
			if (!isNaN(<any>details.level)) {
				details.level = parseInt(details.level, 10);
			} else {
				details.levelName = details.level;
				if (details.level.startsWith('first')) {
					details.level = 0;
				} else {
					// TODO: get actual max level;
					details.level = 10;
				}
			}
		}
		if (typeof details.distance === 'string') {
			details.distance = parseFloat(details.distance);
		}
		this.details = details;
		this.bitmap = game.make.bitmapData(details.width * details.tilesize, details.height * details.tilesize);
		this.loadTexture(this.bitmap);
		game.add.existing(this);
		
		if (details.tilesetName) {
			this.tilesetImage = game.make.image(0, 0, details.tilesetName);
			this.tilesetSize = Helper.getTilesetSize(game.cache.getImage(details.tilesetName));
			
			this.tileCrop = new Phaser.Rectangle(0, 0, Globals.TILE_SIZE, Globals.TILE_SIZE);
			this.tilesetImage.crop(this.tileCrop);
		}
		const skip = 'Navigation Collision HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});
		
		this.zIndex = this.details.level * 10;
		if (isNaN(this.zIndex)) {
			this.zIndex = 999;
		}
		// this.visible = false;
		this.renderAll();
	}
	
	renderAll() {
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
	
	drawTile(x: number, y: number, tile: number) {
		const bitmap = this.bitmap;
		const tileset = this.tilesetImage;
		const details = this.details;
		const tileSize = details.tilesize;
		
		const oldTile = details.data[y][x];
		if (oldTile === tile) {
			return;
		}
		details.data[y][x] = tile;
		const tileX = x * tileSize;
		const tileY = y * tileSize;
		bitmap.clear(tileX, tileY, tileSize, tileSize);
		if (tile !== 0) {
			this.makeTile(tile);
			bitmap.draw(tileset, tileX, tileY);
		}
	}
	
	makeTile(index: number) {
		const tilesize = this.details.tilesize;
		const crop = this.tileCrop;
		
		const p = Helper.getTilePos(this.tilesetSize, index);
		
		crop.x = p.x * tilesize;
		crop.y = p.y * tilesize;
		
		this.tilesetImage.updateCrop();
	}
	
	destroy() {
		if (this.bitmap) {
			this.bitmap.destroy();
		}
		if (this.tilesetImage) {
			this.tilesetImage.destroy();
		}
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
		
		this.bitmap.resize(width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
		
		this.renderAll();
	}
	
	fill(newTile: number, p: Point) {
		const data = this.details.data;
		const prev = data[p.y][p.x];
		if (newTile === prev) {
			return;
		}
		
		let toCheck: Point[] = [p];
		while (toCheck.length > 0) {
			const currP = toCheck.pop();
			const tile = data[currP.y][currP.x];
			if (tile === prev) {
				data[currP.y][currP.x] = newTile;
				toCheck = toCheck.concat(this.getNeighbours(currP));
			}
		}
		
		this.renderAll();
	}
	
	private getNeighbours(p: Point): Point[] {
		const out: Point[] = [];
		
		if (p.x > 0) {
			out.push({x: p.x - 1, y: p.y});
		}
		if (p.x < this.details.width - 1) {
			out.push({x: p.x + 1, y: p.y});
		}
		if (p.y > 0) {
			out.push({x: p.x, y: p.y - 1});
		}
		if (p.y < this.details.height - 1) {
			out.push({x: p.x, y: p.y + 1});
		}
		
		return out;
	}
	
	exportLayer() {
		const out: MapLayer = Object.assign({}, this.details);
		if (out.levelName) {
			out.level = out.levelName;
			out.levelName = undefined;
		}
		return out;
	}
}
