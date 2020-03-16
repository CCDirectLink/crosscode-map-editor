import {BoundaryTracer} from './boundary-tracer';
import {RadialSweepTracer} from './radial-sweep-tracer';
import {SimpleTileLayer} from '../simple-tile-layer';
import {Point} from '../../../../models/cross-code-map';
import Tile = Phaser.Tilemaps.Tile;

describe('boundary tracing', () => {
	
	let tracer: BoundaryTracer;
	
	beforeEach(() => {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	beforeEach(() => {
		tracer = new RadialSweepTracer();
	});
	
	// to generate output in tracer:
	//      let pathOut = '\n';
	// 		for (const tile of path) {
	// 			pathOut += `{x: ${tile.x}, y: ${tile.y}},\n`;
	// 		}
	// 		console.log('path', pathOut);
	//
	// 		for (const hole of holes) {
	// 			let pathOut = '\n';
	// 			for (const tile of path) {
	// 				pathOut += `{x: ${tile.x}, y: ${tile.y}},\n`;
	// 			}
	// 			console.log('hole', pathOut);
	// 		}
	
	// https://user-images.githubusercontent.com/9483499/76783283-e52c9d00-67b1-11ea-8761-b49a62526d73.png
	it('simple rectangle without holes', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 2, y: 2},
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 3, y: 4},
				{x: 4, y: 4},
				{x: 5, y: 4},
				{x: 5, y: 3},
				{x: 5, y: 2},
				{x: 4, y: 2},
				{x: 3, y: 2},
			],
			holes: []
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76783353-055c5c00-67b2-11ea-9e3f-e6184d4f659b.png
	it('simple with corners', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 11, 2, 8, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 10, 2, 9, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 3, y: 1},
				{x: 2, y: 2},
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 3, y: 5},
				{x: 4, y: 5},
				{x: 5, y: 4},
				{x: 5, y: 3},
				{x: 5, y: 2},
				{x: 4, y: 1},
			],
			holes: []
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76783703-a77c4400-67b2-11ea-8c61-1be4a3ee85ff.png
	it('1 tile hole', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 2, 0, 2, 0, 0, 0],
				[0, 0, 2, 2, 2, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 2, y: 5},
				{x: 2, y: 6},
				{x: 3, y: 6},
				{x: 4, y: 6},
				{x: 5, y: 6},
				{x: 5, y: 5},
				{x: 5, y: 4},
				{x: 5, y: 3},
				{x: 4, y: 3},
				{x: 3, y: 3},
			],
			holes: [[
				{x: 3, y: 4},
				{x: 3, y: 5},
				{x: 4, y: 5},
				{x: 4, y: 4},
			]]
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76783543-59ffd700-67b2-11ea-9541-e86f7861c466.png
	it('4 tile hole', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 2, 2, 2, 2, 2, 2, 0],
				[0, 2, 2, 2, 2, 2, 2, 0],
				[0, 2, 2, 0, 0, 2, 2, 0],
				[0, 2, 2, 0, 0, 2, 2, 0],
				[0, 2, 2, 2, 2, 2, 2, 0],
				[0, 2, 2, 2, 2, 2, 2, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 1, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3},
				{x: 1, y: 4},
				{x: 1, y: 5},
				{x: 1, y: 6},
				{x: 1, y: 7},
				{x: 2, y: 7},
				{x: 3, y: 7},
				{x: 4, y: 7},
				{x: 5, y: 7},
				{x: 6, y: 7},
				{x: 7, y: 7},
				{x: 7, y: 6},
				{x: 7, y: 5},
				{x: 7, y: 4},
				{x: 7, y: 3},
				{x: 7, y: 2},
				{x: 7, y: 1},
				{x: 6, y: 1},
				{x: 5, y: 1},
				{x: 4, y: 1},
				{x: 3, y: 1},
				{x: 2, y: 1},
			],
			holes: [[
				{x: 3, y: 3},
				{x: 3, y: 4},
				{x: 3, y: 5},
				{x: 4, y: 5},
				{x: 5, y: 5},
				{x: 5, y: 4},
				{x: 5, y: 3},
				{x: 4, y: 3},
			]]
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76784090-5456c100-67b3-11ea-961b-1aedb4faedd2.png
	it('hole with diagonals', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 2, 2, 2, 2, 2, 0, 0],
				[0, 2, 9, 0, 10, 2, 0, 0],
				[0, 2, 0, 0, 0, 2, 0, 0],
				[0, 2, 2, 8, 11, 2, 0, 0],
				[0, 2, 2, 2, 2, 2, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 1, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3},
				{x: 1, y: 4},
				{x: 1, y: 5},
				{x: 1, y: 6},
				{x: 2, y: 6},
				{x: 3, y: 6},
				{x: 4, y: 6},
				{x: 5, y: 6},
				{x: 6, y: 6},
				{x: 6, y: 5},
				{x: 6, y: 4},
				{x: 6, y: 3},
				{x: 6, y: 2},
				{x: 6, y: 1},
				{x: 5, y: 1},
				{x: 4, y: 1},
				{x: 3, y: 1},
				{x: 2, y: 1},
			],
			holes: [[
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 3, y: 4},
				{x: 4, y: 5},
				{x: 5, y: 4},
				{x: 5, y: 3},
				{x: 4, y: 2},
				{x: 3, y: 2},
			]]
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76784400-d941da80-67b3-11ea-8193-1e0753aa76f6.png
	it('weird shape', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 9, 10, 0, 0, 0, 0],
				[0, 0, 8, 11, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 2, y: 2},
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 3, y: 4},
				{x: 4, y: 4},
				{x: 4, y: 3},
				{x: 4, y: 2},
				{x: 3, y: 2},
			],
			holes: [[
				{x: 3, y: 2},
				{x: 2, y: 3},
				{x: 3, y: 4},
				{x: 4, y: 3},
			]]
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76784726-6e44d380-67b4-11ea-9236-af4817cba85d.png
	it('complex', () => {
		compare({
			start: {x: 2, y: 2},
			layer: [
				[0, 0, 0, 0, 11, 8, 0, 0],
				[0, 11, 2, 2, 9, 10, 2, 0],
				[0, 2, 9, 0, 0, 0, 2, 0],
				[0, 2, 0, 11, 2, 2, 2, 0],
				[0, 2, 2, 2, 0, 0, 2, 0],
				[0, 10, 2, 2, 8, 0, 2, 0],
				[0, 0, 0, 10, 2, 2, 2, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		}, {
			path: [
				{x: 2, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3},
				{x: 1, y: 4},
				{x: 1, y: 5},
				{x: 2, y: 6},
				{x: 3, y: 6},
				{x: 4, y: 7},
				{x: 5, y: 7},
				{x: 6, y: 7},
				{x: 7, y: 7},
				{x: 7, y: 6},
				{x: 7, y: 5},
				{x: 7, y: 4},
				{x: 7, y: 3},
				{x: 7, y: 2},
				{x: 7, y: 1},
				{x: 6, y: 1},
				{x: 5, y: 0},
				{x: 4, y: 1},
				{x: 3, y: 1},
			],
			holes: [[
				{x: 2, y: 3},
				{x: 2, y: 4},
				{x: 3, y: 4},
				{x: 4, y: 3},
				{x: 5, y: 3},
				{x: 6, y: 3},
				{x: 6, y: 2},
				{x: 5, y: 1},
				{x: 4, y: 2},
				{x: 3, y: 2},
			], [
				{x: 4, y: 4},
				{x: 4, y: 5},
				{x: 5, y: 6},
				{x: 6, y: 6},
				{x: 6, y: 5},
				{x: 6, y: 4},
				{x: 5, y: 4},
			]]
		});
	});
	
	function compare(input: { start: Point, layer: number[][] }, expected: { path: Point[], holes: Point[][] }) {
		const layer = new SimpleTileLayer();
		
		layer.initSimple(input.layer);
		const tiles = new Set<Tile>();
		tiles.add(layer.getTileAt(input.start.x, input.start.y)!);
		const traceObj = tracer.getContour(tiles, layer);
		
		expected.path = reorder(expected.path, traceObj.path[0]);
		const holes = [];
		for (let i = 0; i < expected.holes.length; i++) {
			const hole = expected.holes[i];
			holes.push(reorder(hole, traceObj.holes[i][0]));
		}
		expected.holes = holes;
		
		expect(traceObj.path).toEqual(expected.path);
		expect(traceObj.holes).toEqual(expected.holes);
	}
	
	// doesn't matter where the path starts, only the order is important
	function reorder(path: Point[], startPoint: Point) {
		const index = path.findIndex(p => p.x === startPoint.x && p.y === startPoint.y);
		expect(index).toBeGreaterThanOrEqual(0, `path should not contain point: {${startPoint.x}/${startPoint.y}}`);
		return rotate(path, index);
	}
	
	function rotate(arr: Array<any>, n: number) {
		return arr.slice(n, arr.length).concat(arr.slice(0, n));
	}
});
