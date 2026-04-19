import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface BlockTypeDef {
	offY: number;
	flipX: boolean;
	wallY: number;
}

const BLOCK_TYPES: Record<string, BlockTypeDef | undefined> = {
	SQUARE: { offY: 128, flipX: false, wallY: 0 },
	CORNER_NE: { offY: 64, flipX: false, wallY: 0 },
	CORNER_SE: { offY: 0, flipX: false, wallY: 1 },
	CORNER_SW: { offY: 0, flipX: true, wallY: 1 },
	CORNER_NW: { offY: 64, flipX: true, wallY: 0 },
};

export interface WaterBlockAttributes {
	blockType: string;
	changeDuration?: number;
}

export class WaterBlock extends DefaultEntity {

	protected override async setupType(settings: WaterBlockAttributes): Promise<void> {
		const type = BLOCK_TYPES[settings.blockType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			namedSheets: {
				block: {
					mapStyle: 'waterblock',
					width: 32,
					height: 64,
					xCount: 4,
					offY: type.offY,
				},
			},
			sheet: 'block',
			flipX: type.flipX,
			wallY: type.wallY,
			SUB: [{
				name: 'water',
				frames: [0],
				framesAlpha: [0.7],
			}],
		};
		
		await this.applyAnims({
			anims,
			animName: 'water',
			label: settings.blockType,
			mapStyle: 'waterblock',
			baseSize: { x: 32, y: 32, z: 32 },
		});
	}
	
}
