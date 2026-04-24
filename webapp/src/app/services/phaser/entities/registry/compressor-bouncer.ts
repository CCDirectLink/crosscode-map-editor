import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { FACE4 } from './npc';

type Face4 = keyof typeof FACE4;

export interface CompressorBouncerAttributes {
	dir?: Face4;
	spawnCondition?: unknown;
	condition?: string;
}

const DIR_TILE_OFFSETS = [0, 4, 8, 4];
const DIR_FLIP_X = [0, 0, 0, 1];

export class CompressorBouncer extends DefaultEntity {
	
	protected override async setupType(settings: CompressorBouncerAttributes): Promise<void> {
		const dirIndex = FACE4[settings.dir ?? 'NORTH'] ?? 0;
		
		const animName = settings.condition ? 'off' : 'on';
		
		const anims: Anims = {
			sheet: { mapStyle: 'bouncer', width: 16, height: 32, xCount: 4 },
			tileOffset: DIR_TILE_OFFSETS[dirIndex],
			flipX: !!DIR_FLIP_X[dirIndex],
			size: { x: 16, y: 0, z: 32 },
			wallY: 0,
			offset: { y: 4 },
			SUB: [
				{ name: 'on', frames: [3] },
				{ name: 'off', frames: [0], wallY: 1, offset: { y: -4 }, size: { x: 16, y: 16, z: 0 } },
			],
		};
		
		// HACK, probably workaround for wallY 
		(anims.SUB as unknown as Anims[])[1].offset!.y! += 8;
		
		
		await this.applyAnims({
			anims,
			animName,
			label: 'CompressorBouncer',
			baseSize: { x: 8, y: 8, z: 24 },
		});
	}
	
}
