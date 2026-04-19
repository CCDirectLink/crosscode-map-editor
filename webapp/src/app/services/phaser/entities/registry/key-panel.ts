import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { Point3 } from '../../../../models/cross-code-map';

export interface KeyPanelAttributes {
	keyType: string;
}

interface KeyPanelType {
	size: Point3;
	sprite: { x: number; y: number; w: number; h: number };
}

const KEY_TYPES: Record<string, KeyPanelType | undefined> = {
	REGULAR: {
		size: { x: 16, y: 16, z: 1 },
		sprite: { x: 48, y: 88, w: 24, h: 24 },
	},
	MASTER: {
		size: { x: 24, y: 24, z: 1 },
		sprite: { x: 48, y: 112, w: 32, h: 32 },
	},
};

export class KeyPanel extends DefaultEntity {

	protected override async setupType(settings: KeyPanelAttributes): Promise<void> {
		const type = KEY_TYPES[settings.keyType];
		if (!type) {
			return this.generateErrorImage();
		}
		
		const anims: Anims = {
			sheet: {
				mapStyle: 'puzzle2',
				width: type.sprite.w,
				height: type.sprite.h,
				xCount: 2,
				offX: type.sprite.x,
				offY: type.sprite.y,
			},
			offset: { x: 0, y: (type.sprite.h - type.size.y) / 2, z: 0 },
			SUB: [
				{ name: 'on', frames: [1] },
				{ name: 'off', frames: [0] },
			],
		};
		
		await this.applyAnims({
			anims,
			animName: 'off',
			label: settings.keyType,
			mapStyle: 'puzzle2',
			baseSize: type.size,
		});
	}
	
}
