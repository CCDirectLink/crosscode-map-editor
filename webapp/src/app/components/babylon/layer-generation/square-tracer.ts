import Tile = Phaser.Tilemaps.Tile;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import {Point} from '../../../models/cross-code-map';

export class SquareTracer {
	getContour(tiles: Set<Tile>, layer: DynamicTilemapLayer) {
		console.log('start square tracing algorithm');
		// use top left as starting point
		let startTile = tiles.values().next().value;
		for (const value of tiles.values()) {
			if (value.x + value.y < startTile.x + startTile.y) {
				startTile = value;
			}
		}
		
		const boundaryPoints = new Set<Tile>();
		
		boundaryPoints.add(startTile);
		
		let nextStep = {x: 0, y: 1};
		let next = this.pointAdd(startTile, nextStep);
		
		while (next.x !== startTile.x || next.y !== startTile.y) {
			const phaserTile = layer.getTileAt(next.x, next.y);
			if (tiles.has(phaserTile)) {
				boundaryPoints.add(phaserTile);
				nextStep = this.goLeft(nextStep);
				next = this.pointAdd(next, nextStep);
			} else {
				next = this.pointSub(next, nextStep);
				nextStep = this.goRight(nextStep);
				next = this.pointAdd(next, nextStep);
			}
		}
		
		return boundaryPoints;
	}
	
	private pointAdd(p1: Point, p2: Point) {
		return {
			x: p1.x + p2.x,
			y: p1.y + p2.y
		};
	}
	
	private pointSub(p1: Point, p2: Point) {
		return {
			x: p1.x - p2.x,
			y: p1.y - p2.y
		};
	}
	
	private goLeft(p: Point) {
		return {
			x: -p.y,
			y: p.x
		};
	}
	
	private goRight(p: Point) {
		return {
			x: p.y,
			y: -p.x
		};
	}
}
