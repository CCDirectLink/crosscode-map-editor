import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

const PANEL_TYPES: Record<string, number | undefined> = {
	DEFAULT: 0,
	NORTH: 1,
	EAST: 4,
	SOUTH: 2,
	WEST: 3,
};

export interface JumpPanelFloatAttributes {
	panelType: string;
	jumpDistance?: string;
	condition?: string;
}

export class JumpPanelFloat extends DefaultEntity {

	protected override async setupType(settings: JumpPanelFloatAttributes): Promise<void> {
		const tileOffset = PANEL_TYPES[settings.panelType] ?? PANEL_TYPES['DEFAULT']!;

		const anims: Anims = {
			sheet: {
				src: 'media/entity/objects/object-effects.png',
				width: 24,
				height: 24,
				offX: 128 + tileOffset * 24,
				offY: 144,
				xCount: 2,
			},
			SUB: [
				{ name: 'off', frames: [] },
				{ name: 'normal', frames: [0] },
				{ name: 'glow', frames: [0] },
			],
		};

		const ok = await this.applyAnims({
			anims,
			animName: 'glow',
			label: 'JumpPanelFloat',
			baseSize: { x: 24, y: 24, z: 0 },
		});
		if (!ok) {
			this.generateErrorImage();
		}
	}
}
