import * as Phaser from 'phaser';
import { MapLayer, Point } from '../../../models/cross-code-map';
import { Helper } from '../helper';
import Tile = Phaser.Tilemaps.Tile;

export class CCMapLayer {
	
	public details!: MapLayer;
	
	private layer!: Phaser.Tilemaps.TilemapLayer;
	
	constructor(private tilemap: Phaser.Tilemaps.Tilemap) {
	}
	
	public async init(details: MapLayer) {
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
		// noinspection SuspiciousTypeOfGuard
		if (typeof details.distance === 'string') {
			details.distance = parseFloat(details.distance);
		}
		this.details = details;
		this.layer = this.tilemap.createBlankLayer(details.name + Math.random(), 'stub');
		if (details.data) {
			this.layer.putTilesAt(details.data, 0, 0, false);
		}
		await this.updateTileset(details.tilesetName!);
		this.updateLevel(this.details.level);
		
		const skip = 'Navigation Collision HeightMap'.split(' ');
		// const skip = 'Navigation Background HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});
	}
	
	get visible(): boolean {
		return this.layer.visible;
	}
	
	set visible(val: boolean) {
		this.layer.visible = val;
		this.layer.active = val;
	}
	
	get alpha(): number {
		return this.layer.alpha;
	}
	
	set alpha(val: number) {
		this.layer.alpha = val;
	}
	
	destroy() {
		this.layer.destroy();
	}
	
	offsetLayer(offset: Point, borderTiles = false) {
		const data = this.layer.layer.data;
		const newData: number[][] = [];
		
		for (let y = 0; y < data.length; y++) {
			newData[y] = [];
			for (let x = 0; x < data[y].length; x++) {
				let newTile: Tile | undefined;
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
				newData[y][x] = newTile?.index ?? 0;
			}
		}
		this.layer.putTilesAt(newData, 0, 0, false);
	}
	
	resize(width: number, height: number) {
		const data = this.layer.layer.data;
		this.details.width = width;
		this.details.height = height;
		
		const newData: number[][] = [];
		for (let y = 0; y < height; y++) {
			newData[y] = [];
			const old = data[y] || [];
			for (let x = 0; x < width; x++) {
				newData[y][x] = old[x]?.index ?? 0;
			}
		}
		const tilesetName = this.layer.tileset[0].name;
		const visible = this.layer.visible;
		this.layer.destroy();
		
		this.layer = this.tilemap.createBlankLayer(this.details.name + Math.random(), tilesetName, 0, 0, width, height);
		this.layer.putTilesAt(newData, 0, 0, false);
		this.visible = visible;
	}
	
	async updateTileset(tilesetname: string) {
		const details = this.details;
		details.tilesetName = tilesetname;
		
		const oldLayer = this.layer;
		await Helper.loadTexture(tilesetname, this.tilemap.scene);
		
		const newTileset = this.tilemap.addTilesetImage(tilesetname, undefined, undefined, undefined, undefined, undefined, 1);
		this.layer = this.tilemap.createBlankLayer(details.name + Math.random(), newTileset ?? [], 0, 0, details.width, details.height);
		this.layer.putTilesAt(oldLayer.layer.data, 0, 0, false);
		
		oldLayer.destroy();
	}
	
	updateLevel(level: number) {
		this.details.level = level;
		let zIndex = this.details.level * 10;
		if (isNaN(zIndex)) {
			zIndex = 999;
		}
		this.layer.depth = this.details.level * 10;
	}
	
	getPhaserLayer(): Phaser.Tilemaps.TilemapLayer {
		return this.layer;
	}
	
	exportLayer(): MapLayer {
		const out: MapLayer = Object.assign({}, this.details);
		if (out.levelName) {
			out.level = out.levelName;
			delete out.levelName;
		}
		out.data = [];
		this.extractLayerData(out);
		return out;
	}
	
	private extractLayerData(layer: MapLayer): void {
		this.layer.getTilesWithin().forEach(tile => {
			if (!layer.data[tile.y]) {
				layer.data[tile.y] = [];
			}
			layer.data[tile.y][tile.x] = tile.index;
		});
	}
}
