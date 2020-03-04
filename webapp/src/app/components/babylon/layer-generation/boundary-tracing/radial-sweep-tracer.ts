import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Tile = Phaser.Tilemaps.Tile;
import {Point} from '../../../../models/cross-code-map';
import {SimpleTileLayer} from '../simple-tile-layer';

interface TracerTile extends Tile {
	prev?: TracerTile;
}

export class RadialSweepTracer {
	getContour(tiles: Set<Tile>, layer: SimpleTileLayer) {
		// prepare tiles
		const preparedLayer = new SimpleTileLayer();
		preparedLayer.initLayerForDiagonals(layer);
		// preparedLayer.debug();
		
		// use top left as starting point
		let startTile = tiles.values().next().value;
		for (const value of tiles.values()) {
			if (value.x + value.y < startTile.x + startTile.y) {
				startTile = value;
			}
		}
		
		let realStartTile = preparedLayer.getTileAt(startTile.x, startTile.y);
		if (!realStartTile || realStartTile.index === 0) {
			realStartTile = preparedLayer.getTileAt(startTile.x + 1, startTile.y)!;
		}
		
		const boundaryPoints = new Set<TracerTile>();
		
		const startDir = {x: 0, y: 1};
		let dir = {x: startDir.x, y: startDir.y};
		let next: TracerTile = realStartTile;
		
		while (next !== realStartTile || boundaryPoints.size === 0) {
			boundaryPoints.add(next);
			const container = this.getNext(next, dir, preparedLayer);
			dir = container.dir;
			if (!boundaryPoints.has(container.next)) {
				container.next.prev = next;
			}
			next = container.next;
		}
		
		return boundaryPoints;
	}
	
	private getNext(tile: Tile, dir: Point, layer: SimpleTileLayer): { next: TracerTile, dir: Point } {
		dir.x *= -1;
		dir.y *= -1;
		for (let i = 0; i < 8; i++) {
			dir = this.rotate(dir);
			const next = layer.getTileAt(tile.x + dir.x, tile.y + dir.y);
			if (next && next.index !== 0) {
				if (dir.x === 0 || dir.y === 0 || layer.canConnect(tile, dir)) {
					return {next: next, dir: dir};
				}
			}
		}
		
		throw new Error('next boundary tile not found, should never happen');
	}
	
	/** rotates vector by 45 degrees counter clockwise. Only useful to get directions, because vector size is changed */
	private rotate(dir: Point): Point {
		return {
			x: Math.max(Math.min(dir.y + dir.x, 1), -1),
			y: Math.max(Math.min(dir.y - dir.x, 1), -1),
		};
	}
}
