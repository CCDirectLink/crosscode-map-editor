import {MapLayer, Point, MapLayerLevel} from '../../../models/cross-code-map';
import * as Phaser from 'phaser';

export class CCMapLayer {
	private layer?: Phaser.Tilemaps.DynamicTilemapLayer;
	
	constructor(
		scene: Phaser.Scene,
		private tilemap: Phaser.Tilemaps.Tilemap,
		public readonly data: MapLayer,
	) {
		// noinspection SuspiciousTypeOfGuard
		if (typeof data.distance === 'string') {
			data.distance = parseFloat(data.distance);
		}
		this.data = data;
		this.layer = this.tilemap.createBlankDynamicLayer(data.name + Math.random(), 'stub');
		
		this.updateTileset(data.tilesetName!);
		this.updateLevel(this.level);
		
		const skip = 'Navigation Collision HeightMap'.split(' ');
		// const skip = 'Navigation Background HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === data.type) {
				if (this.layer) {
					this.layer.visible = false;
				}
			}
		});
	}
	
	get visible(): boolean {
		if (!this.layer) {
			return false;
		}
		return this.layer.visible;
	}
	
	set visible(val: boolean) {
		if (this.layer) {
			this.layer.visible = val;
		}
	}
	
	get alpha(): number {
		if (!this.layer) {
			return 1;
		}
		return this.layer.alpha;
	}
	
	set alpha(val: number) {
		if (this.layer) {
			this.layer.alpha = val;
		}
	}

	get level(): number {
		if (typeof this.data.level === 'string') {
			if (!isNaN(Number(this.data.level))) {
				return parseInt(this.data.level, 10);
			} else {
				this.data.levelName = this.data.level;
				if (this.data.level.startsWith('first')) {
					return 0;
				} else {
					return 10;
				}
			}
		}
		return this.data.level;
	}
	
	destroy() {
		if (this.layer) {
			this.layer.destroy();
			this.layer = undefined;
		}
	}
	
	offsetLayer(offset: Point, borderTiles = false) {
		const data = this.data.data;
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

		this.data.data = newData;
		if (this.layer) {
			this.layer.putTilesAt(this.data.data, 0, 0, false);
		}
	}
	
	resize(width: number, height: number, skipRender = false) {
		if (!this.layer) {
			return;
		}
		const details = this.data;
		details.width = width;
		details.height = height;
		
		
		const newData: number[][] = [];
		for (let y = 0; y < details.height; y++) {
			newData[y] = [];
			const old = details.data[y] || [];
			for (let x = 0; x < details.width; x++) {
				newData[y][x] = old[x] || 0;
			}
		}
		details.data = newData;
		const tilesetName = this.layer.tileset[0].name;
		const visible = this.layer.visible;
		this.layer.destroy();
		
		this.layer = this.tilemap.createBlankDynamicLayer(details.name + Math.random(), tilesetName, 0, 0, details.width, details.height);
		this.layer.putTilesAt(details.data, 0, 0, false);
		this.layer.visible = visible;
	}
	
	updateTileset(tilesetname: string) {
		const details = this.data;
		details.tilesetName = tilesetname;
		if (details.tilesetName) {
			if (this.layer) {
				this.layer.destroy();
				this.layer = undefined;
			}
			const newTileset = this.tilemap.addTilesetImage(tilesetname);
			if (!newTileset) {
				return;
			}
			newTileset.firstgid = 1;
			this.layer = this.tilemap.createBlankDynamicLayer(details.name + Math.random(), newTileset, 0, 0, details.width, details.height);
			this.layer.putTilesAt(details.data, 0, 0, false);
		}
	}
	
	updateLevel(level: number) {
		this.data.level = level;
		let zIndex = this.data.level * 10;
		if (isNaN(zIndex)) {
			zIndex = 999;
		}
		if (this.layer) {
			this.layer.depth = this.data.level * 10;
		}
	}
	
	getPhaserLayer(): Phaser.Tilemaps.DynamicTilemapLayer | undefined {
		return this.layer;
	}
	
	exportLayer(): MapLayer {
		const out: MapLayer = Object.assign({}, this.data);
		if (out.levelName) {
			out.level = out.levelName as MapLayerLevel;
			out.levelName = undefined;
		}
		out.data = [];
		if (this.layer) {
			this.layer.getTilesWithin().forEach(tile => {
				if (!out.data[tile.y]) {
					out.data[tile.y] = [];
				}
				out.data[tile.y][tile.x] = tile.index;
			});
		}
		return out;
	}
}
