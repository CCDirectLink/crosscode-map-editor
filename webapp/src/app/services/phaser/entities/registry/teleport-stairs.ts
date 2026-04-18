import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

type StairType = 'UPWARDS_EAST' | 'UPWARDS_WEST' | 'DOWNWARDS_EAST' | 'DOWNWARDS_WEST';

export interface TeleportStairsAttributes {
	stairType?: StairType;
}

interface StairConfig {
	down: boolean;
	flip: boolean;
}

const STAIR_TYPES: Record<StairType, StairConfig | undefined> = {
	UPWARDS_EAST: { down: false, flip: false },
	UPWARDS_WEST: { down: false, flip: true },
	DOWNWARDS_EAST: { down: true, flip: false },
	DOWNWARDS_WEST: { down: true, flip: true },
};

export class TeleportStairs extends DefaultEntity {
	
	protected override async setupType(settings: TeleportStairsAttributes): Promise<void> {
		const stair = STAIR_TYPES[settings.stairType!];
		const style = Helper.getMapStyle(Globals.map, 'map');
		const stairDoor = style?.stairDoor;
		if (!stair || !stairDoor) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			namedSheets: {
				stair: {
					mapStyle: 'map',
					width: 32,
					height: 48,
					offX: stairDoor.x + (stair.down ? 32 : 0),
					offY: stairDoor.y,
				},
			},
			sheet: 'stair',
			flipX: stair.flip,
			SUB: [{ name: 'idle', frames: [0] }],
		};
		
		const ok = await this.applyAnims(anims, 'idle', 'TeleportStairs', 'map');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = { x: 32, y: 16, z: 48 };
		this.updateSettings();
	}
	
}
