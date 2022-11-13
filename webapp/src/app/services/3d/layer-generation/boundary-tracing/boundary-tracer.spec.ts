import { Point } from '../../../../models/cross-code-map';
import { SimpleTileLayer } from '../simple-tile-layer';
import { BoundaryTracer } from './boundary-tracer';
import { NodeTracer } from './node-grid';

describe('boundary tracing', () => {
	
	let tracer: BoundaryTracer;
	
	beforeEach(() => {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	beforeEach(() => {
		tracer = new NodeTracer();
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
		compare(0, {
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
		compare(0, {
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
		compare(0, {
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
		compare(0, {
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
		compare(0, {
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
	
	// don't care about result, just don't crash
	describe('crash tests', () => {
		
		// https://user-images.githubusercontent.com/9483499/76784400-d941da80-67b3-11ea-8193-1e0753aa76f6.png
		it('weird shape', () => {
			const layer = new SimpleTileLayer();
			
			layer.initSimple([
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 9, 10, 0, 0, 0, 0],
				[0, 0, 8, 11, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]);
			const traceObj = tracer.getContour(layer);
			console.log(traceObj);
		});
		
		// https://user-images.githubusercontent.com/9483499/76887863-2fca1a00-6883-11ea-98f8-547ca0f7fbb5.png
		it('?!', () => {
			const layer = new SimpleTileLayer();
			
			layer.initSimple([
				[0, 10, 2, 10, 10, 8, 8, 8],
				[0, 9, 10, 10, 10, 8, 10, 8],
				[2, 9, 10, 0, 2, 0, 2, 8],
				[11, 9, 10, 2, 10, 8, 2, 0],
				[0, 2, 8, 8, 9, 8, 8, 0],
				[10, 9, 8, 8, 11, 9, 8, 0],
				[2, 8, 11, 8, 10, 11, 0, 0],
				[10, 8, 8, 8, 2, 0, 0, 0]
			]);
			const traceObj = tracer.getContour(layer);
			console.log(traceObj);
		});
		
		// https://user-images.githubusercontent.com/9483499/76967305-89842000-6927-11ea-9df7-f7b36a7b1100.png
		it('?!²', () => {
			const layer = new SimpleTileLayer();
			layer.initSimple([
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11, 0, 11, 8, 8, 0, 0],
				[0, 0, 0, 10, 0, 0, 0, 0, 2, 0, 2, 2, 11, 8, 10, 8, 11, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 10, 0, 0, 10, 2, 8, 9, 9, 8, 10, 11, 10, 8, 0],
				[0, 0, 0, 0, 0, 0, 2, 9, 0, 10, 10, 9, 10, 10, 10, 10, 11, 0, 10, 0],
				[0, 0, 0, 0, 0, 0, 0, 2, 8, 10, 9, 11, 11, 11, 8, 11, 2, 2, 10, 0],
				[0, 0, 0, 0, 0, 9, 8, 2, 2, 2, 9, 11, 10, 8, 9, 10, 11, 2, 8, 0],
				[0, 0, 0, 0, 0, 9, 8, 2, 10, 11, 9, 9, 10, 9, 2, 10, 11, 8, 2, 0],
				[0, 0, 0, 0, 0, 9, 8, 9, 0, 2, 10, 9, 11, 11, 11, 0, 8, 10, 2, 0],
				[0, 0, 0, 0, 0, 0, 8, 8, 0, 9, 11, 9, 0, 11, 8, 11, 0, 0, 10, 2],
				[0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 8, 9, 8, 11, 11, 11, 10, 0, 10],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 11, 9, 9, 9, 9, 9, 9, 10],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 11, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			]);
			const result = tracer.getContour(layer);
			console.log(result);
		});
		
		// https://user-images.githubusercontent.com/9483499/76968814-cc46f780-6929-11ea-87fc-c32401af7e2d.png
		it('evil pattern', () => {
			const layer = new SimpleTileLayer();
			layer.initSimple([
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 2, 0, 0],
				[0, 0, 11, 0, 0, 0],
				[0, 0, 2, 0, 0, 0],
				[0, 2, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0]
			]);
			const result = tracer.getContour(layer);
			console.log(result);
		});
		
		// https://user-images.githubusercontent.com/9483499/80650239-e967fd80-8a73-11ea-9c58-00dc8e0f2a52.png
		it('forest/caves/cave-013-pandza-01', () => {
			const layer = new SimpleTileLayer();
			layer.initSimple([
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2],
				[2, 0, 0, 0, 2, 2, 2, 2, 0, 2, 2],
				[2, 0, 0, 2, 9, 0, 0, 10, 0, 2, 2],
				[2, 2, 9, 0, 0, 0, 0, 0, 10, 2, 2],
				[2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
			]);
			const result = tracer.getContour(layer);
			console.log(result);
		});
		
	});
	
	
	// https://user-images.githubusercontent.com/9483499/76784726-6e44d380-67b4-11ea-9236-af4817cba85d.png
	it('complex', () => {
		compare(0, {
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
	
	// https://user-images.githubusercontent.com/9483499/76882082-6bacb180-687a-11ea-9977-8c7380648600.png
	it('full collision', () => {
		compare(0, {
			layer: [
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2]
			]
		}, {
			path: [
				{x: 0, y: 0},
				{x: 0, y: 1},
				{x: 0, y: 2},
				{x: 0, y: 3},
				{x: 0, y: 4},
				{x: 0, y: 5},
				{x: 0, y: 6},
				{x: 0, y: 7},
				{x: 0, y: 8},
				{x: 0, y: 9},
				{x: 1, y: 9},
				{x: 2, y: 9},
				{x: 3, y: 9},
				{x: 4, y: 9},
				{x: 5, y: 9},
				{x: 6, y: 9},
				{x: 7, y: 9},
				{x: 8, y: 9},
				{x: 8, y: 8},
				{x: 8, y: 7},
				{x: 8, y: 6},
				{x: 8, y: 5},
				{x: 8, y: 4},
				{x: 8, y: 3},
				{x: 8, y: 2},
				{x: 8, y: 1},
				{x: 8, y: 0},
				{x: 7, y: 0},
				{x: 6, y: 0},
				{x: 5, y: 0},
				{x: 4, y: 0},
				{x: 3, y: 0},
				{x: 2, y: 0},
				{x: 1, y: 0},
			],
			holes: []
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76883774-f2fb2480-687c-11ea-9414-e38689674677.png
	describe('inception', () => {
		it('outer', () => {
			compare(0, {
				layer: [
					[11, 2, 2, 2, 2, 2, 2, 8],
					[2, 9, 0, 0, 0, 0, 10, 2],
					[2, 0, 11, 2, 2, 8, 0, 2],
					[2, 0, 2, 9, 10, 2, 0, 2],
					[2, 0, 2, 8, 11, 2, 0, 2],
					[2, 0, 10, 2, 2, 9, 0, 2],
					[2, 8, 0, 0, 0, 0, 11, 2],
					[10, 2, 2, 2, 2, 2, 2, 9],
				]
			}, {
				path: [
					{x: 1, y: 0},
					{x: 0, y: 1},
					{x: 0, y: 2},
					{x: 0, y: 3},
					{x: 0, y: 4},
					{x: 0, y: 5},
					{x: 0, y: 6},
					{x: 0, y: 7},
					{x: 1, y: 8},
					{x: 2, y: 8},
					{x: 3, y: 8},
					{x: 4, y: 8},
					{x: 5, y: 8},
					{x: 6, y: 8},
					{x: 7, y: 8},
					{x: 8, y: 7},
					{x: 8, y: 6},
					{x: 8, y: 5},
					{x: 8, y: 4},
					{x: 8, y: 3},
					{x: 8, y: 2},
					{x: 8, y: 1},
					{x: 7, y: 0},
					{x: 6, y: 0},
					{x: 5, y: 0},
					{x: 4, y: 0},
					{x: 3, y: 0},
					{x: 2, y: 0},
				],
				holes: [[
					{x: 2, y: 1},
					{x: 1, y: 2},
					{x: 1, y: 3},
					{x: 1, y: 4},
					{x: 1, y: 5},
					{x: 1, y: 6},
					{x: 2, y: 7},
					{x: 3, y: 7},
					{x: 4, y: 7},
					{x: 5, y: 7},
					{x: 6, y: 7},
					{x: 7, y: 6},
					{x: 7, y: 5},
					{x: 7, y: 4},
					{x: 7, y: 3},
					{x: 7, y: 2},
					{x: 6, y: 1},
					{x: 5, y: 1},
					{x: 4, y: 1},
					{x: 3, y: 1},
				]]
			});
		});
		
		it('inner', () => {
			compare(1, {
				layer: [
					[11, 2, 2, 2, 2, 2, 2, 8],
					[2, 9, 0, 0, 0, 0, 10, 2],
					[2, 0, 11, 2, 2, 8, 0, 2],
					[2, 0, 2, 9, 10, 2, 0, 2],
					[2, 0, 2, 8, 11, 2, 0, 2],
					[2, 0, 10, 2, 2, 9, 0, 2],
					[2, 8, 0, 0, 0, 0, 11, 2],
					[10, 2, 2, 2, 2, 2, 2, 9],
				]
			}, {
				path: [
					{x: 3, y: 2},
					{x: 2, y: 3},
					{x: 2, y: 4},
					{x: 2, y: 5},
					{x: 3, y: 6},
					{x: 4, y: 6},
					{x: 5, y: 6},
					{x: 6, y: 5},
					{x: 6, y: 4},
					{x: 6, y: 3},
					{x: 5, y: 2},
					{x: 4, y: 2},
				],
				holes: [[
					{x: 3, y: 4},
					{x: 4, y: 5},
					{x: 5, y: 4},
					{x: 4, y: 3},
				]]
			});
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76885959-5d619400-6880-11ea-9851-76321d165598.png
	describe('separate blocks', () => {
		it('top left', () => {
			compare(0, {
				layer: [
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 11, 2, 2, 0, 2, 8, 0],
					[0, 2, 2, 2, 0, 2, 2, 0],
					[0, 2, 2, 2, 0, 2, 2, 0],
					[0, 0, 0, 0, 0, 2, 2, 0],
					[0, 0, 2, 2, 2, 2, 9, 0],
					[0, 0, 10, 2, 2, 9, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0]
				]
			}, {
				path: [
					{x: 2, y: 1},
					{x: 1, y: 2},
					{x: 1, y: 3},
					{x: 1, y: 4},
					{x: 2, y: 4},
					{x: 3, y: 4},
					{x: 4, y: 4},
					{x: 4, y: 3},
					{x: 4, y: 2},
					{x: 4, y: 1},
					{x: 3, y: 1},
				],
				holes: []
			});
		});
		
		it('bottom right', () => {
			compare(1, {
				layer: [
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 11, 2, 2, 0, 2, 8, 0],
					[0, 2, 2, 2, 0, 2, 2, 0],
					[0, 2, 2, 2, 0, 2, 2, 0],
					[0, 0, 0, 0, 0, 2, 2, 0],
					[0, 0, 2, 2, 2, 2, 9, 0],
					[0, 0, 10, 2, 2, 9, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0]
				]
			}, {
				path: [
					{x: 5, y: 1},
					{x: 5, y: 2},
					{x: 5, y: 3},
					{x: 5, y: 4},
					{x: 5, y: 5},
					{x: 4, y: 5},
					{x: 3, y: 5},
					{x: 2, y: 5},
					{x: 2, y: 6},
					{x: 3, y: 7},
					{x: 4, y: 7},
					{x: 5, y: 7},
					{x: 6, y: 6},
					{x: 7, y: 5},
					{x: 7, y: 4},
					{x: 7, y: 3},
					{x: 7, y: 2},
					{x: 6, y: 1},
				],
				holes: []
			});
		});
	});
	
	// https://user-images.githubusercontent.com/9483499/76888261-eb8b4980-6883-11ea-87f1-31d7f0171fc8.png
	it('all types of tiles', () => {
		compare(0, {
			layer: [
				[0, 1, 1, 1, 1, 1, 4, 0],
				[0, 27, 2, 2, 2, 24, 5, 0],
				[0, 2, 25, 1, 26, 2, 6, 0],
				[0, 2, 24, 1, 27, 2, 7, 0],
				[12, 26, 2, 2, 2, 25, 0, 0],
				[13, 3, 23, 2, 20, 3, 3, 3],
				[14, 0, 22, 2, 21, 16, 17, 3],
				[15, 0, 3, 3, 3, 18, 19, 3]
			]
		}, {
			path: [
				{x: 2, y: 1},
				{x: 1, y: 2},
				{x: 1, y: 3},
				{x: 1, y: 4},
				{x: 2, y: 5},
				{x: 3, y: 5},
				{x: 2, y: 6},
				{x: 3, y: 7},
				{x: 4, y: 7},
				{x: 5, y: 6},
				{x: 4, y: 5},
				{x: 5, y: 5},
				{x: 6, y: 4},
				{x: 6, y: 3},
				{x: 6, y: 2},
				{x: 5, y: 1},
				{x: 4, y: 1},
				{x: 3, y: 1},
			],
			holes: [[
				{x: 3, y: 2},
				{x: 2, y: 3},
				{x: 3, y: 4},
				{x: 4, y: 4},
				{x: 5, y: 3},
				{x: 4, y: 2},
			]]
		});
	});
	
	function compare(index: number, input: { layer: number[][] }, expected: { path: Point[], holes: Point[][] }) {
		const layer = new SimpleTileLayer();
		
		layer.initSimple(input.layer);
		
		const result = tracer.getContour(layer);
		
		const traceObj = result[index];
		
		expected.path = reorder(expected.path, traceObj.points[0]);
		const holes = [];
		for (let i = 0; i < expected.holes.length; i++) {
			const hole = expected.holes[i];
			holes.push(reorder(hole, traceObj.holes[i][0]));
		}
		expected.holes = holes;
		
		expect(traceObj.points.map(p => ({x: p.x, y: p.y}))).toEqual(expected.path);
		expect(traceObj.holes.map(h => h.map(p => ({x: p.x, y: p.y})))).toEqual(expected.holes);
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
