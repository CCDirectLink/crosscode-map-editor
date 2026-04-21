import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { Point3 } from '../../../../models/cross-code-map';
import { DefaultEntity } from './default-entity';

interface LorryType {
	size: Point3;
	gfx: { x: number; y: number; w: number; h: number; xCount: number };
}

const LORRY_TYPES: Record<string, LorryType | undefined> = {
	BIG: {
		size: { x: 48, y: 48, z: 2 },
		gfx: { x: 0, y: 0, w: 48, h: 48, xCount: 1 },
	},
};

export interface LorryAttributes {
	lorryType: string;
}

export class Lorry extends DefaultEntity {

	protected override async setupType(settings: LorryAttributes): Promise<void> {
		const type = LORRY_TYPES[settings.lorryType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		const style = Helper.getMapStyle(Globals.map, 'lorry');
		const anims: Anims = {
			sheet: {
				src: style?.sheet,
				width: type.gfx.w,
				height: type.gfx.h,
				xCount: type.gfx.xCount,
				offX: (style?.lorryX ?? 0) + type.gfx.x,
				offY: (style?.lorryY ?? 0) + type.gfx.y,
			},
			SUB: [
				{ name: 'off', frames: [0] },
				{ name: 'on', frames: [1] },
			],
		};

		await this.applyAnims({
			anims,
			animName: 'off',
			label: 'Lorry',
			baseSize: type.size,
		});
	}

}
