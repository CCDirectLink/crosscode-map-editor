import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface PoleTypeDef {
	sizeZ: number;
	offX: number;
	offY: number;
}

const POLE_TYPES: Record<string, PoleTypeDef | undefined> = {
	LONG: { sizeZ: 48, offX: 0, offY: 144 },
	LONG_64: { sizeZ: 80, offX: 80, offY: 144 },
	SHORT: { sizeZ: 16, offX: 0, offY: 208 },
};

export interface ElementPoleAttributes {
	poleType: string;
	group?: string;
	spawnCondition?: unknown;
}

export class ElementPole extends DefaultEntity {

	protected override async setupType(settings: ElementPoleAttributes): Promise<void> {
		const type = POLE_TYPES[settings.poleType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		const anims: Anims = {
			namedSheets: {
				pole: {
					mapStyle: 'puzzle2',
					width: 16,
					height: 16 + type.sizeZ,
					offX: type.offX,
					offY: type.offY,
				},
			},
			sheet: 'pole',
			SUB: [{ name: 'on', frames: [0] }],
		};

		const ok = await this.applyAnims(anims, 'on', settings.poleType, 'puzzle2');
		if (!ok) {
			this.generateErrorImage();
			return;
		}

		this.entitySettings.baseSize = { x: 16, y: 16, z: type.sizeZ };
		this.updateSettings();
	}

}
