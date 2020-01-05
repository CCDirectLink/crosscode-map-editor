import Tile = Phaser.Tilemaps.Tile;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import {Point} from '../../../models/cross-code-map';

export class SimpleTileLayer {
	
	private data: Tile[][] = [];
	private width = 0;
	private height = 0;
	private diagonalConnector = new Map<number, Set<number>>();
	
	public init(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = new Array(height);
		for (let i = 0; i < height; i++) {
			this.data[i] = new Array(width);
			const row = this.data[i];
			for (let j = 0; j < width; j++) {
				row[j] = new Tile(null as any, 0, j, i, 1, 1, 1, 1);
			}
		}
	}
	
	public initLayer(layer: DynamicTilemapLayer) {
		this.init(layer.tilemap.width + 1, layer.tilemap.height + 1);
		layer.getTilesWithin().forEach(tile => {
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
			if (i === 8) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
				connections.push({
					c1: {x: 0, y: 0},
					c2: {x: 1, y: 1}
				});
			}
			
			// ◤
			if (i === 9) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				connections.push({
					c1: {x: 1, y: 0},
					c2: {x: 0, y: 1}
				});
			}
			
			// ◥
			if (i === 10) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 1, y: 1});
				connections.push({
					c1: {x: 0, y: 0},
					c2: {x: 1, y: 1}
				});
			}
			
			// ◢
			if (i === 11) {
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
	
	public getTileAt(tileX: number, tileY: number) {
		if (!this.isInLayerBounds(tileX, tileY)) {
			return null;
			
		}
		const tile = this.data[tileY][tileX];
		return tile || null;
	}
	
	public setTileAt(index: number, x: number, y: number) {
		if (this.isInLayerBounds(x, y)) {
			this.data[y][x].index = index;
		}
	}
	
	public debug() {
		let all = '';
		for (let j = 0; j < this.height; j++) {
			let row = '';
			for (let i = 0; i < this.width; i++) {
				row += this.getTileAt(i, j)!.index === 2 ? 'X' : '.';
			}
			all += row + '\n';
		}
	}
	
	private p2Hash(p: Point) {
		return p.x * 100000 + p.y;
	}
	
	private isInLayerBounds(tileX: number, tileY: number) {
		return (tileX >= 0 && tileX < this.width && tileY >= 0 && tileY < this.height);
	}
	
	canConnect(tile: Tile, dir: Point) {
		const group = this.diagonalConnector.get(this.p2Hash(tile));
		if (!group) {
			return false;
		}
		return group.has(this.p2Hash({x: tile.x + dir.x, y: tile.y + dir.y}));
	}
}
