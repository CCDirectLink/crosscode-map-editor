import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface BlockerTypeDef {
	offY: number;
	flipX: boolean;
}

const BLOCKER_TYPES: Record<string, BlockerTypeDef | undefined> = {
	diagonalNW: { offY: 128, flipX: false },
	diagonalNE: { offY: 128, flipX: true },
	diagonalSE: { offY: 192, flipX: true },
	diagonalSW: { offY: 192, flipX: false },
};

export interface BlockerAttributes {
	blockerType: string;
	condition?: unknown;
}

export class Blocker extends DefaultEntity {

	protected override async setupType(settings: BlockerAttributes): Promise<void> {
		const type = BLOCKER_TYPES[settings.blockerType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		const anims: Anims = {
			sheet: { mapStyle: 'puzzle', width: 32, height: 64, offY: type.offY },
			flipX: type.flipX,
			SUB: [{ name: 'on', frames: [5, 6] }],
		};

		await this.applyAnims({
			anims,
			animName: 'on',
			label: settings.blockerType,
			mapStyle: 'puzzle',
			baseSize: { x: 32, y: 32, z: 24 },
		});
	}

}
