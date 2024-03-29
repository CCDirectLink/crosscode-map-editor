import { LayerMeshGenerator } from './layer-mesh-generator';
import { SimpleTileLayer } from './simple-tile-layer';

describe('layer mesh generator', () => {
	
	beforeEach(() => {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	
	// outputs 2d array similar to the following test cases
	// `[\n${data.map(inner => '\t[' + inner.join(', ') + ']').join(',\n')}
	// ]`
	describe('layer transformations below master level', () => {
		
		it('empty layer => full with red blocks', () => {
			compare([
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			[
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
			]);
		});
		
		it('blue blocks => holes', () => {
			compare([
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			[
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
			]);
		});
		
		it('complex blue shape', () => {
			compare(
				[
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 7, 1, 1, 0, 0, 0, 0, 0, 0],
					[0, 0, 7, 1, 1, 5, 0, 0, 0, 0, 0, 0],
					[0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 6, 1, 1, 1, 4, 0, 0, 0, 0, 0],
					[0, 0, 0, 6, 1, 1, 5, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 9, 0, 0, 2, 2, 2, 2, 2, 2],
					[2, 2, 9, 0, 0, 11, 2, 2, 2, 2, 2, 2],
					[2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 8, 0, 0, 0, 10, 2, 2, 2, 2, 2],
					[2, 2, 2, 8, 0, 0, 11, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
				]
			);
		});
		
		it('complex shape on edge', () => {
			compare(
				[
					[1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0],
					[1, 5, 0, 0, 6, 1, 5, 0, 0, 0, 0, 0],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0, 0, 0, 0, 11, 2, 2, 2, 2],
					[0, 11, 2, 2, 8, 0, 11, 2, 2, 2, 2, 2],
					[0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
					[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
				]
			);
		});
		
		function compare(input: number[][], expected: number[][]) {
			const generator = new LayerMeshGenerator();
			const layer = new SimpleTileLayer();
			
			layer.initSimple(input);
			generator.transformToBelowMaster(layer);
			expect(layer.exportLayer()).toEqual(expected);
		}
	});
});
