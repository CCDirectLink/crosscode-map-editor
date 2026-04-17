import { ScaleSettings } from '../cc-entity';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface WaterBlockAttributes {
	blockType: string;
	changeDuration?: number;
}

interface BlockTypeDef {
	offY: number;
	flipX: boolean;
	wallY: number;
}

const BLOCK_TYPES: Record<string, BlockTypeDef> = {
	SQUARE: { offY: 128, flipX: false, wallY: 0 },
	CORNER_NE: { offY: 64, flipX: false, wallY: 0 },
	CORNER_SE: { offY: 0, flipX: false, wallY: 1 },
	CORNER_SW: { offY: 0, flipX: true, wallY: 1 },
	CORNER_NW: { offY: 64, flipX: true, wallY: 0 },
};

export class WaterBlock extends DefaultEntity {
	
	public override getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected override async setupType(settings: WaterBlockAttributes): Promise<void> {
		const attributes = this.getAttributes();
		attributes['blockType'].options = {};
		for (const name of Object.keys(BLOCK_TYPES)) {
			attributes['blockType'].options[name] = name;
		}
		
		const type = BLOCK_TYPES[settings.blockType];
		if (!type) {
			this.generateNoImageType(0xFF0000, 1);
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
		
		const ok = await this.applyAnims(anims, 'water', settings.blockType, 'waterblock');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = { x: 32, y: 32, z: 32 };
		this.updateSettings();
	}
	
}
