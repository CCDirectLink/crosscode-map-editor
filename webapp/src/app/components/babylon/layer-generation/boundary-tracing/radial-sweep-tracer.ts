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
		const path = this.shrinkPath(boundaryPoints);
		const holes = this.findHoles(path, layer, preparedLayer);
		
		return {
			path: path,
			holes: holes
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
	
	private findHoles(path: Point[], layer: SimpleTileLayer, preparedLayer: SimpleTileLayer) {
		let inside: Tile[] = [];
		
		// path nodes cannot be empty, ignore them
		
		const points = path.map(p => new Phaser.Geom.Point(p.x, p.y));
		const polygon = new Polygon(points);
		
		// find every blue/hole inside the polygon
		for (const tile of layer.tiles.flat()) {
			
			// i care only about no/blue tiles
			const blue = [0, 1, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27];
			if (!blue.includes(tile.index)) {
				continue;
			}
			
			// ignore single tile holes, current implementation does weird stuff
			const neighbours = [
				layer.getTileAt(tile.x + 1, tile.y),
				layer.getTileAt(tile.x - 1, tile.y),
				layer.getTileAt(tile.x, tile.y + 1),
				layer.getTileAt(tile.x, tile.y - 1),
			];
			
			if (!neighbours.some(n => blue.includes(n ? n.index : -1))) {
				continue;
			}
			
			// only tiles that have some distance from the border to avoid bugs, again, implementation is not that great
			if (points.some(p => {
				const diffX = Math.abs(p.x - tile.x);
				const diffY = Math.abs(p.y - tile.y);
				return diffX <= 1 && diffY <= 1 && diffX + diffY <= 1;
			})) {
				continue;
			}
			
			
			if (!polygon.contains(tile.x, tile.y)) {
				continue;
			}
			
			inside.push(tile);
		}
		const holes: Point[][] = [];
		
		// as long as there are holes left, trace them (100 = failsafe)
		for (let i = 0; i < 100 && inside.length > 0; i++) {
			const tile = inside[0];
			
			const invertedLayer = new SimpleTileLayer();
			invertedLayer.initLayerInverted(inside, layer.width, layer.height);
			const forTracing = new SimpleTileLayer();
			forTracing.initLayerForTracing(invertedLayer);
			const hole = this.getContourInternal(tile.x * 2, tile.y * 2, forTracing);
			const holeArr = this.shrinkPath(hole);
			holes.push(holeArr);
			
			const holePoly = new Polygon(holeArr.map(p => new Phaser.Geom.Point(p.x, p.y)));
			inside = inside.filter(insideTile => {
				if (holeArr.some(p => {
					const diffX = Math.abs(p.x - insideTile.x);
					const diffY = Math.abs(p.y - insideTile.y);
					return diffX <= 1 && diffY <= 1 && diffX + diffY <= 1;
				})) {
					return false;
				}
				
				return !holePoly.contains(insideTile.x, insideTile.y) &&
					!holePoly.contains(insideTile.x + 1, insideTile.y) &&
					!holePoly.contains(insideTile.x - 1, insideTile.y) &&
					!holePoly.contains(insideTile.x, insideTile.y + 1) &&
					!holePoly.contains(insideTile.x, insideTile.y - 1);
			});
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
