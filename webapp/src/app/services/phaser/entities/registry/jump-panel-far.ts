import { Point } from '../../../../models/cross-code-map';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface PanelTypeDef {
	size: { x: number; y: number };
	tileOffset: number;
	flipX: boolean;
	gfxOffset: Point;
}

const PANEL_TYPES: Record<string, PanelTypeDef | undefined> = {
	NORTH: { size: { x: 16, y: 24 }, tileOffset: 8, flipX: false, gfxOffset: { x: 0, y: -5 } },
	EAST: { size: { x: 24, y: 16 }, tileOffset: 0, flipX: false, gfxOffset: { x: 1, y: 0 } },
	SOUTH: { size: { x: 16, y: 24 }, tileOffset: 16, flipX: false, gfxOffset: { x: 0, y: -6 } },
	WEST: { size: { x: 24, y: 16 }, tileOffset: 0, flipX: true, gfxOffset: { x: -1, y: 0 } },
};

export interface JumpPanelFarAttributes {
	panelType: string;
	jumpDistance?: string;
	condition?: string;
}

export class JumpPanelFar extends DefaultEntity {
	
	protected override async setupType(settings: JumpPanelFarAttributes): Promise<void> {
		const type = PANEL_TYPES[settings.panelType] ?? PANEL_TYPES['NORTH']!;
		
		const anims: Anims = {
			sheet: {
				src: 'media/entity/objects/object-effects.png',
				width: 16,
				height: 16,
				offY: 16,
				xCount: 8,
			},
			gfxOffset: type.gfxOffset,
			tileOffset: type.tileOffset,
			flipX: type.flipX,
			renderMode: 'lighter',
			SUB: [
				{ name: 'off', frames: [] },
				{ name: 'normal', frames: [4, 5, 6, 7] },
				{ name: 'glow', frames: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3] },
			],
		};
		
		const ok = await this.applyAnims({
			anims,
			animName: 'normal',
			label: 'JumpPanelFar',
			baseSize: { x: type.size.x, y: type.size.y, z: 0 },
		});
		if (!ok) {
			this.generateErrorImage();
		}
	}
}
