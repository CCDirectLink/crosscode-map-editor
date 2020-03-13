import Tile = Phaser.Tilemaps.Tile;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import {Point} from '../../../models/cross-code-map';

export class SimpleTileLayer {
	
	private _data: Tile[][] = [];
	
	public get tiles(): Phaser.Tilemaps.Tile[][] {
		return this._data;
	}
	
	private _width = 0;
	public get width(): number {
		return this._width;
	}
	
	private _height = 0;
	public get height(): number {
		return this._height;
	}
	
	private _extendedBottom = 0;
	get extendedBottom(): number {
		return this._extendedBottom;
	}
	
	private diagonalConnector = new Map<number, Set<number>>();
	
	public init(width: number, height: number) {
		this._width = width;
		this._height = height;
		this._data = new Array(height);
		for (let i = 0; i < height; i++) {
			this._data[i] = new Array(width);
			const row = this._data[i];
			for (let j = 0; j < width; j++) {
				row[j] = new Tile(null as any, 0, j, i, 1, 1, 1, 1);
			}
		}
	}
	
	public initSimple(tiles: number[][]) {
		const width = tiles[0].length;
		const height = tiles.length;
		this._width = width;
		this._height = height;
		this._data = new Array(height);
		for (let i = 0; i < height; i++) {
			this._data[i] = new Array(width);
			const row = this._data[i];
			for (let j = 0; j < width; j++) {
				row[j] = new Tile(null as any, tiles[i][j], j, i, 1, 1, 1, 1);
			}
		}
	}
	
	public initLayerForTracing(layer: SimpleTileLayer) {
		let tiles: Tile[];
		tiles = layer.tiles.flat();
		
		this.init(layer.width * 2, layer.height * 2);
		tiles.forEach(tile => {
			const i = tile.index;
			const dirs: Point[] = [];
			
			// ■
			if (i === 2) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
			}
			
			// ◣
			if (i === 8 || i === 24) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
			}
			
			// ◤
			if (i === 9 || i === 25) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
			}
			
			// ◥
			if (i === 10 || i === 26) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 1, y: 1});
			}
			
			// ◢
			if (i === 11 || i === 27) {
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
			}
			
			for (const d of dirs) {
				this.setTileAt(2, tile.x * 2 + d.x, tile.y * 2 + d.y);
			}
		});
	}
	
	public initLayerInverted(layer: SimpleTileLayer) {
		const width = layer.width;
		const height = layer.height;
		this._width = width;
		this._height = height;
		this._data = new Array(height);
		for (let i = 0; i < height; i++) {
			this._data[i] = new Array(width);
			const row = this._data[i];
			for (let j = 0; j < width; j++) {
				const otherIndex = layer._data[i][j].index;
				row[j] = new Tile(null as any, otherIndex === 2 ? 0 : 2, j, i, 1, 1, 1, 1);
			}
		}
	}
	
	public initLayer(layer: DynamicTilemapLayer) {
		this.init(layer.layer.width, layer.layer.height);
		
		// TODO: set directly, skip isInLayerBounds check
		for (const tile of layer.getTilesWithin()) {
			this.setTileAt(tile.index, tile.x, tile.y);
		}
	}
	
	extendBottom(offset: number) {
		if (offset < 0) {
			// this.tiles.length = this.tiles.length + offset;
		} else {
			for (let i = 0; i < offset; i++) {
				const lastRow = this.tiles[this.tiles.length - 1];
				this.tiles.push(lastRow.map(tile => new Tile(
					tile.layer,
					tile.index,
					tile.x,
					tile.y + 1,
					tile.width,
					tile.height,
					tile.baseWidth,
					tile.baseHeight)
				));
			}
		}
		this._height = this.tiles.length;
		this._extendedBottom += offset;
	}
	
	public getTileAt(tileX: number, tileY: number) {
		if (!this.isInLayerBounds(tileX, tileY)) {
			return null;
		}
		const tile = this._data[tileY][tileX];
		return tile || null;
	}
	
	public setTileAt(index: number, x: number, y: number) {
		if (this.isInLayerBounds(x, y)) {
			this._data[y][x].index = index;
		}
	}
	
	public debug() {
		let all = '';
		for (let j = 0; j < this._height; j++) {
			let row = '';
			for (let i = 0; i < this._width; i++) {
				row += this.getTileAt(i, j)!.index === 2 ? 'X' : '.';
			}
			all += row + '\n';
		}
	}
	
	private isInLayerBounds(tileX: number, tileY: number) {
		return (tileX >= 0 && tileX < this._width && tileY >= 0 && tileY < this._height);
	}
	
	public exportLayer() {
		return this.tiles.map(row => row.map(tile => tile.index));
	}
}
