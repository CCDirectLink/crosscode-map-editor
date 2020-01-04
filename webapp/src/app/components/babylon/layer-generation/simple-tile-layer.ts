import Tile = Phaser.Tilemaps.Tile;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import {Point} from '../../../models/cross-code-map';

export class SimpleTileLayer {
	
	private data: Tile[][] = [];
	private width = 0;
	private height = 0;
	private uselesTile = new Tile(null as any, 0, 0, 0, 0, 0, 0, 0);
	
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
			}
			
			// ◤
			if (i === 9) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
			}
			
			// ◥
			if (i === 10) {
				dirs.push({x: 0, y: 0});
				dirs.push({x: 1, y: 0});
				dirs.push({x: 1, y: 1});
			}
			
			// ◢
			if (i === 11) {
				dirs.push({x: 1, y: 0});
				dirs.push({x: 0, y: 1});
				dirs.push({x: 1, y: 1});
			}
			
			for (const d of dirs) {
				this.setTileAt(2, tile.x + d.x, tile.y + d.y);
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
		console.log(all);
	}
	
	private isInLayerBounds(tileX: number, tileY: number) {
		return (tileX >= 0 && tileX < this.width && tileY >= 0 && tileY < this.height);
	}
}
