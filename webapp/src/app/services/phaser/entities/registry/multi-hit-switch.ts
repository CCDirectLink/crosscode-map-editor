import { Point3 } from '../../../../models/cross-code-map';
import { Anims, AnimSheet } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface MultiHitSwitchAttributes {
	switchType: string;
	variable?: string;
	addValue?: string;
	spawnCondition?: unknown;
}

interface MultiHitSwitchType {
	size: Point3;
	sheet: AnimSheet;
	offFrame: number;
	renderMode?: string;
}

const SIZE: Point3 = { x: 16, y: 16, z: 17 };

const TYPES: Record<string, MultiHitSwitchType | undefined> = {
	default: {
		size: SIZE,
		sheet: {
			mapStyle: 'puzzle',
			width: 16,
			height: 32,
			offY: 32,
		},
		offFrame: 0,
	},
	arSwitch: {
		size: SIZE,
		sheet: {
			src: 'media/entity/objects/dungeon-ar.png',
			width: 16,
			height: 32,
			offY: 256,
		},
		offFrame: 0,
		renderMode: 'lighter',
	},
};

export class MultiHitSwitch extends DefaultEntity {
	
	protected override async setupType(settings: MultiHitSwitchAttributes): Promise<void> {
		const type = TYPES[settings.switchType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			sheet: type.sheet,
			tileOffset: type.offFrame,
			renderMode: type.renderMode,
		};
		
		await this.applyAnims({
			anims,
			label: settings.switchType,
			baseSize: type.size,
		});
	}
	
}
