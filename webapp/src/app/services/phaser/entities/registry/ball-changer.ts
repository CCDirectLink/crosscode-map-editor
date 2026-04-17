import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { FACE8 } from './npc';

type Face8 = keyof typeof FACE8;
type Element = 'HEAT' | 'COLD' | 'SHOCK' | 'WAVE';

export interface BallChangerAttributes {
	changerType?: {
		type: 'CHANGE_DIR' | 'CHANGE_SPEED' | 'RESET_SPEED' | 'CHANGE_ELEMENT';
		settings: {
			dir?: Face8;
			factor?: number;
			element?: Element;
		};
	};
	condition?: unknown;
	ballTime?: number;
	resetBounce?: boolean;
}

interface ChangerIcon {
	icon: number;
	sphereColor: number;
	flipX: boolean;
	flipY: boolean;
}

function resolveChangerIcon(changerType: NonNullable<BallChangerAttributes['changerType']>): ChangerIcon {
	const out: ChangerIcon = { icon: 0, sphereColor: 0, flipX: false, flipY: false };
	switch (changerType.type) {
		case 'CHANGE_DIR':
			switch (changerType.settings.dir) {
				case 'NORTH':
					out.icon = 0;
					break;
				case 'EAST':
					out.icon = 1;
					break;
				case 'SOUTH':
					out.icon = 0;
					out.flipY = true;
					break;
				case 'WEST':
					out.icon = 1;
					out.flipX = true;
					break;
				case 'NORTH_EAST':
					out.icon = 2;
					break;
				case 'SOUTH_EAST':
					out.icon = 2;
					out.flipY = true;
					break;
				case 'SOUTH_WEST':
					out.icon = 2;
					out.flipX = true;
					out.flipY = true;
					break;
				case 'NORTH_WEST':
					out.icon = 2;
					out.flipX = true;
					break;
			}
			break;
		case 'CHANGE_SPEED':
			out.icon = 3;
			break;
		case 'RESET_SPEED':
			out.icon = 4;
			break;
		case 'CHANGE_ELEMENT':
			switch (changerType.settings.element) {
				case 'HEAT':
					out.icon = 5;
					out.sphereColor = 1;
					break;
				case 'COLD':
					out.icon = 6;
					out.sphereColor = 2;
					break;
				case 'SHOCK':
					out.icon = 7;
					out.sphereColor = 3;
					break;
				case 'WAVE':
					out.icon = 8;
					out.sphereColor = 4;
					break;
			}
			break;
	}
	return out;
}

export class BallChanger extends DefaultEntity {

	protected override async setupType(settings: BallChangerAttributes): Promise<void> {
		if (!settings.changerType) {
			this.generateNoImageType();
			return;
		}
		
		const { icon, sphereColor, flipX, flipY } = resolveChangerIcon(settings.changerType);
		
		const anims: Anims = {
			namedSheets: {
				base: { mapStyle: 'puzzle2', width: 16, height: 16, offX: 144, offY: 64 },
				sphere: { mapStyle: 'puzzle2', width: 16, height: 16, offX: 192, offY: 64, xCount: 4 },
				icon: { mapStyle: 'puzzle2', width: 16, height: 16, offX: 144, offY: 80, xCount: 3 },
			},
			SUB: [{
				size: { x: 16, y: 16, z: 0 },
				offset: { y: -4 },
				sheet: 'base',
				SUB: [{ name: 'on', time: 1, frames: [2] }],
			}, {
				size: { x: 16, y: 0, z: 16 },
				offset: { z: 12, y: -5 },
				renderMode: 'lighter',
				sheet: 'sphere',
				tileOffset: 4 + sphereColor * 4,
				SUB: [{ name: 'on', time: 0.15, frames: [0], repeat: true }],
			}, {
				size: { x: 16, y: 0, z: 16 },
				offset: { z: 13, y: -4 },
				sheet: 'icon',
				frames: [icon],
				flipX,
				flipY,
				SUB: [{ name: 'on' }],
			}],
		};
		
		const ok = await this.applyAnims(anims, 'on', 'BallChanger');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = { x: 24, y: 24, z: 0 };
		this.updateSettings();
	}
	
}
