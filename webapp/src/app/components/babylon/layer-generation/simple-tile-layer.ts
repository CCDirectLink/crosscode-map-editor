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
	
	public initLayerForDiagonals(layer: DynamicTilemapLayer | SimpleTileLayer) {
		let width = 0;
		let height = 0;
		let tiles: Tile[];
		if (layer instanceof SimpleTileLayer) {
			width = layer.width;
			height = layer.height;
			tiles = layer.tiles.flat();
		} else {
			width = layer.layer.width;
			height = layer.layer.height;
			tiles = layer.getTilesWithin();
		}
		
		this.init(width + 1, height + 1);
		tiles.forEach(tile => {
			const i = tile.index;
			const dirs: Point[] = [];
			const connections: { c1: Point, c2: Point }[] = [];
			
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
				connections.push({
					c1: {x: 0, y: 0},
					c2: {x: 1, y: 1}
				});
			}
			
			// ◤
			if (i === 9 || i === 25) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				connections.push({
					c1: {x: 1, y: 0},
					c2: {x: 0, y: 1}
				});
			}
			
			// ◥
			if (i === 10 || i === 26) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 1, y: 1});
				connections.push({
					c1: {x: 0, y: 0},
					c2: {x: 1, y: 1}
				});
			}
			
			// ◢
			if (i === 11 || i === 27) {
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
				connections.push({
					c1: {x: 1, y: 0},
					c2: {x: 0, y: 1}
				});
			}
			
			for (const d of dirs) {
				this.setTileAt(2, tile.x + d.x, tile.y + d.y);
			}
			for (const connection of connections) {
				const c1 = this.p2Hash({x: tile.x + connection.c1.x, y: tile.y + connection.c1.y});
				const c2 = this.p2Hash({x: tile.x + connection.c2.x, y: tile.y + connection.c2.y});
				let group = this.diagonalConnector.get(c1);
				if (!group) {
					group = new Set<number>();
					this.diagonalConnector.set(c1, group);
				}
				group.add(c2);
				
				group = this.diagonalConnector.get(c2);
				if (!group) {
					group = new Set<number>();
					this.diagonalConnector.set(c2, group);
				}
				group.add(c1);
			}
			
			
		});
		
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
			throw new Error('bottom cannot be extended with a negative number');
		}
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
	
	private p2Hash(p: Point) {
		return p.x * 100000 + p.y;
	}
	
	private isInLayerBounds(tileX: number, tileY: number) {
		return (tileX >= 0 && tileX < this._width && tileY >= 0 && tileY < this._height);
	}
	
	canConnect(tile: Tile, dir: Point) {
		const group = this.diagonalConnector.get(this.p2Hash(tile));
		if (!group) {
			return false;
		}
		return group.has(this.p2Hash({x: tile.x + dir.x, y: tile.y + dir.y}));
	}
	
	public exportLayer() {
		return this.tiles.map(row => row.map(tile => tile.index));
	}
}
