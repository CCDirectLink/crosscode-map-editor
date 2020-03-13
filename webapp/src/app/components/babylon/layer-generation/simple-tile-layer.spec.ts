import {SimpleTileLayer} from './simple-tile-layer';

describe('Simple Tile Layer', () => {
	
	beforeEach(() => {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	describe('layer generation for boundary tracing', () => {
		it('simple 4x4 layer', () => {
			compare([
					[0, 0, 0, 0],
					[0, 0, 2, 0],
					[0, 0, 2, 0],
					[0, 0, 0, 0],
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 2, 2, 0, 0],
					[0, 0, 0, 0, 2, 2, 0, 0],
					[0, 0, 0, 0, 2, 2, 0, 0],
					[0, 0, 0, 0, 2, 2, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
				]);
		});
		
		
		// ◣ i ===  8 || i === 24
		// ◤ i ===  9 || i === 25
		// ◥ i === 10 || i === 26
		// ◢ i === 11 || i === 27
		it('diagonals', () => {
			compare([
					[0, 0, 0, 0],
					[0, 11, 8, 0],
					[0, 10, 9, 0],
					[0, 0, 0, 0],
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 2, 2, 0, 0, 0],
					[0, 0, 2, 2, 2, 2, 0, 0],
					[0, 0, 2, 2, 2, 2, 0, 0],
					[0, 0, 0, 2, 2, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
				]);
		});
		
		it('inner diagonals', () => {
			compare([
					[0, 0, 0, 0],
					[0, 9, 10, 0],
					[0, 8, 11, 0],
					[0, 0, 0, 0],
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 2, 2, 2, 2, 0, 0],
					[0, 0, 2, 0, 0, 2, 0, 0],
					[0, 0, 2, 0, 0, 2, 0, 0],
					[0, 0, 2, 2, 2, 2, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0],
				]);
		});
		
		function compare(input: number[][], expected: number[][]) {
			const inputLayer = new SimpleTileLayer();
			inputLayer.initSimple(input);
			
			const outputLayer = new SimpleTileLayer();
			outputLayer.initLayerForTracing(inputLayer);
			expect(outputLayer.exportLayer()).toEqual(expected);
		}
	});
});
