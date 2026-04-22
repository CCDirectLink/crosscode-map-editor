import { Point3 } from '../../../../models/cross-code-map';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface ExtractPlatformAttributes {
	extractType: string;
	activeZHeight?: number;
	inactiveZHeight?: number;
	condition?: unknown;
}

interface ExtractPlatformType {
	size: Point3;
	offY: number;
}

const TYPES: Record<string, ExtractPlatformType | undefined> = {
	Small: { size: { x: 16, y: 16, z: 16 }, offY: 0 },
	Large: { size: { x: 32, y: 32, z: 32 }, offY: 32 },
};

export class ExtractPlatform extends DefaultEntity {

	protected override async setupType(settings: ExtractPlatformAttributes): Promise<void> {
		const type = TYPES[settings.extractType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		const anims: Anims = {
			sheet: {
				src: 'media/entity/objects/puzzle-elements-1.png',
				width: type.size.x,
				height: type.size.z * 2,
				offY: type.offY,
			},
			SUB: [{ name: 'default', frames: [0] }],
		};

		await this.applyAnims({
			anims,
			label: `ExtractPlatform ${settings.extractType}`,
			baseSize: type.size,
		});
	}

}
