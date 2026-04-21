import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { FACE8 } from './npc';

type Face8 = keyof typeof FACE8;

export interface MagnetAttributes {
	dir?: Face8;
	spawnCondition?: unknown;
	altDirs?: { condition: string; dir: Face8 }[];
}

// 8-dir "off" table from CrossCode source; only indices 0-3 are reachable via FACE4
const DIR_TILE_OFFSETS = [0, 3, 1, 4, 2, 4, 1, 3];
const DIR_FLIP_X = [0, 0, 0, 0, 0, 1, 1, 1];

export class Magnet extends DefaultEntity {

	protected override async setupType(settings: MagnetAttributes): Promise<void> {
		const dirIndex = FACE8[settings.dir ?? 'NORTH'] ?? 0;

		const anims: Anims = {
			sheet: { mapStyle: 'magnet', width: 16, height: 32 },
			SUB: [{
				name: 'off',
				frames: [DIR_TILE_OFFSETS[dirIndex]],
				flipX: !!DIR_FLIP_X[dirIndex],
			}],
		};

		await this.applyAnims({
			anims,
			animName: 'off',
			label: 'Magnet',
			baseSize: { x: 16, y: 16, z: 24 },
		});
	}

}
