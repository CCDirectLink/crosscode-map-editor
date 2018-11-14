import {MapLayer, Point} from '../../../models/cross-code-map';
import * as Phaser from 'phaser-ce';
import {Sortable} from '../../../models/sortable';
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
		// this.backgroundColor = {r: 255, g: 128, b: 0, a: 1};
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
		
		const skip = 'Navigation Collision HeightMap'.split(' ');
		// const skip = 'Navigation Background HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});
		
		this.updateLevel(this.details.level);
		this.updateTileset(details.tilesetName);
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
	
	// checks bounds before drawing
	updateTileChecked(x: number, y: number, tile: number) {
		if (x >= 0 && x < this.details.data[0].length) {
			if (y >= 0 && y < this.details.data.length) {
				this.details.data[y][x] = tile;
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
	
	getTile(x: number, y: number) {
		let index = x + 1;
		index += y * this.tilesetSize.x;
		return index;
	}
	
	clear() {
		this.bitmap.clear();
		this.details.data.forEach(arr => arr.fill(0));
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
	
	resize(width: number, height: number, skipRender = false) {
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
		if (!skipRender) {
			this.renderAll();
		}
	}
	
	offsetLayer(offset: Point, borderTiles = false, skipRender = false) {
		const data = this.details.data;
		const newData: number[][] = JSON.parse(JSON.stringify(data));
		
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				let newTile = 0;
				let row = data[y - offset.y];
				if (!row && borderTiles) {
					row = offset.y > 0 ? data[0] : data[data.length - 1];
				}
				if (row) {
					newTile = row[x - offset.x];
					if (borderTiles && newTile === undefined) {
						newTile = offset.x > 0 ? row[0] : row[row.length - 1];
					}
				}
				newData[y][x] = newTile || 0;
			}
		}
		
		this.details.data = newData;
		if (!skipRender) {
			this.renderAll();
		}
	}
	
	updateTileset(tilesetname: string) {
		const details = this.details;
		details.tilesetName = tilesetname;
		if (details.tilesetName) {
			this.tilesetImage = this.game.make.image(0, 0, details.tilesetName);
			this.tilesetSize = Helper.getTilesetSize(this.game.cache.getImage(details.tilesetName));
			
			this.tileCrop = new Phaser.Rectangle(0, 0, Globals.TILE_SIZE, Globals.TILE_SIZE);
			this.tilesetImage.crop(this.tileCrop);
		}
		this.renderAll();
	}
	
	updateLevel(level) {
		this.details.level = level;
		this.zIndex = this.details.level * 10;
		if (isNaN(this.zIndex)) {
			this.zIndex = 999;
		}
		Globals.zIndexUpdate = true;
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
