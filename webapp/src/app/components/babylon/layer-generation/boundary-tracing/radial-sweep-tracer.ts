import Tile = Phaser.Tilemaps.Tile;
import Polygon = Phaser.Geom.Polygon;
import {Point} from '../../../../models/cross-code-map';
import {SimpleTileLayer} from '../simple-tile-layer';
import {p2Hash, p2HashReverse} from '../point-helper';

interface TracerTile extends Tile {
	prev?: TracerTile;
}

export class RadialSweepTracer {
	getContour(tiles: Set<Tile>, layer: SimpleTileLayer): { path: Point[], holes: Point[][] } {
		// prepare tiles
		const preparedLayer = new SimpleTileLayer();
		preparedLayer.initLayerForTracing(layer);
		// preparedLayer.debug();
		
		// use top left as starting point
		let startTile = tiles.values().next().value;
		for (const value of tiles.values()) {
			if (value.x + value.y < startTile.x + startTile.y) {
				startTile = value;
			}
		}
		
		const startX = startTile.x * 2;
		const startY = startTile.y * 2;
		
		const boundaryPoints = this.getContourInternal(startX, startY, preparedLayer);
		// const holes = this.findHoles(boundaryPoints, preparedLayer);
		
		return {
			path: this.shrinkPath(boundaryPoints),
			// holes: holes.map(hole => this.shrinkPath(hole, true))
			holes: []
		};
	}
	
	private shrinkPath(path: Set<TracerTile>, other = false) {
		const output = new Set<number>();
		
		// shrinks "layer" points back to original size and removes duplicates
		for (const p of path) {
			const x = Math.ceil(p.x / 2);
			const y = Math.ceil(p.y / 2);
			output.add(p2Hash(x, y));
		}
		
		return Array.from(output).map(v => p2HashReverse(v));
	}
	
	// TODO: fails to generate diagonals
	private findHoles(path: Set<TracerTile>, layer: SimpleTileLayer) {
		const visited = new Set<number>();
		
		const invertedLayer = new SimpleTileLayer();
		invertedLayer.initLayerInverted(layer);
		// path nodes cannot be empty, ignore them
		for (const point of path) {
			visited.add(p2Hash(point.x, point.y));
		}
		const points = Array.from(path).map(p => new Phaser.Geom.Point(p.x, p.y));
		const polygon = new Polygon(points);
		const polygonHoles: Polygon[] = [];
		
		const holes = [];
		
		for (const tile of layer.tiles.flat()) {
			if (tile.index === 2) {
				continue;
			}
			
			if (tile.x % 2 === 0 || tile.y % 2 === 0) {
				continue;
			}
			
			const hash = p2Hash(tile.x, tile.y);
			if (visited.has(hash)) {
				continue;
			}
			
			if (!polygon.contains(tile.x, tile.y)) {
				continue;
			}
			
			if (polygonHoles.some(polygon => polygon.contains(tile.x, tile.y))) {
				continue;
			}
			
			// found hole, start tracing algorithm
			const hole = this.getContourInternal(tile.x, tile.y, invertedLayer);
			holes.push(hole);
			for (const point of hole) {
				visited.add(p2Hash(point.x, point.y));
			}
			const polygonHole = new Polygon(Array.from(hole).map(p => new Phaser.Geom.Point(p.x, p.y)));
			polygonHoles.push(polygonHole);
			
		}
		
		return holes;
	}
	
	private getContourInternal(startX: number, startY: number, layer: SimpleTileLayer) {
		
		let realStartTile = layer.getTileAt(startX, startY);
		if (!realStartTile || realStartTile.index === 0) {
			realStartTile = layer.getTileAt(startX + 1, startY)!;
		}
		
		const boundaryPoints = new Set<TracerTile>();
		
		const startDir = {x: 0, y: 1};
		let dir = {x: startDir.x, y: startDir.y};
		let next: TracerTile = realStartTile;
		
		while (next !== realStartTile || boundaryPoints.size === 0) {
			boundaryPoints.add(next);
			const container = this.getNext(next, dir, layer);
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
				return {next: next, dir: dir};
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
