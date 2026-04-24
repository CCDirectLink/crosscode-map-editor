import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

const ROTATE_BLOCKER_DIRS = ['NE', 'SE', 'SW', 'NW'] as const;

export interface RotateBlockerAttributes {
	dir: string;
}

export class RotateBlocker extends DefaultEntity {

	protected override async setupType(settings: RotateBlockerAttributes): Promise<void> {
		const dir = (ROTATE_BLOCKER_DIRS as readonly string[]).includes(settings.dir) ? settings.dir : 'NE';
		const animName = dir.toLowerCase();

		const anims: Anims = {
			namedSheets: {
				ground: {
					mapStyle: 'rotateBlocker',
					width: 32,
					height: 32,
					xCount: 1,
				},
				block: {
					mapStyle: 'rotateBlocker',
					width: 32,
					height: 64,
					offX: 32,
				},
			},
			SUB: [{
				sheet: 'ground',
				shapeType: 'Z_FLAT',
				frames: [1],
				SUB: [
					{ name: 'off' },
					{ name: 'ne' },
					{ name: 'se' },
					{ name: 'sw' },
					{ name: 'nw' },
					{ name: 'turn' },
				],
			}, {
				sheet: 'block',
				renderMode: 'lighter',
				SUB: [
					{ name: 'ne', frames: [1], flipX: false },
					{ name: 'se', frames: [0], flipX: false, wallY: 1 },
					{ name: 'sw', frames: [0], flipX: true, wallY: 1 },
					{ name: 'nw', frames: [1], flipX: true },
				],
			}, {
				sheet: 'ground',
				shapeType: 'Y_FLAT',
				renderMode: 'lighter',
				frames: [0],
				SUB: [
					{ name: 'turn', offset: { z: 1 } },
					{ name: 'turn', offset: { z: 4 } },
					{ name: 'turn', offset: { z: 8 } },
					{ name: 'turn', offset: { z: 12 } },
					{ name: 'turn', offset: { z: 16 } },
					{ name: 'turn', offset: { z: 20 } },
					{ name: 'turn', offset: { z: 24 } },
					{ name: 'turn', offset: { z: 28 } },
					{ name: 'turn', offset: { z: 32 } },
				],
			}],
		};

		await this.applyAnims({
			anims,
			animName,
			label: 'RotateBlocker',
			baseSize: { x: 32, y: 32, z: 32 },
		});
	}

}
