import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

const ELEMENT_INDEX: Record<string, number | undefined> = {
	HEAT: 1,
	COLD: 2,
	SHOCK: 3,
	WAVE: 4,
};

export interface ElementShieldSrcAttributes {
	element?: string;
	spawnCondition?: unknown;
	onActivateAdd?: string;
}

export class ElementShieldSrc extends DefaultEntity {
	
	protected override async setupType(settings: ElementShieldSrcAttributes): Promise<void> {
		const element = settings.element || 'HEAT';
		const elementIdx = ELEMENT_INDEX[element];
		if (!elementIdx) {
			this.generateErrorImage();
			return;
		}
		const ballFrame = 1 + (elementIdx - 1) * 2;
		
		const anims: Anims = {
			namedSheets: {
				panel: {
					mapStyle: 'puzzle2',
					width: 16,
					height: 16,
					xCount: 1,
					offX: 32,
					offY: 48,
				},
				ball: {
					src: 'media/entity/objects/object-effects.png',
					width: 24,
					height: 24,
					xCount: 5,
					offX: 128,
					offY: 64,
				},
			},
			SUB: [{
				sheet: 'panel',
				SUB: [{ name: 'on', frames: [0] }],
			}, {
				sheet: 'ball',
				offset: { z: 12 },
				framesAlpha: [0.6],
				SUB: [
					{ name: 'on', frames: [0] },
					{ name: 'on', frames: [ballFrame], renderMode: 'lighter' },
				],
			}],
		};
		
		await this.applyAnims({
			anims,
			animName: 'on',
			label: 'ElementShieldSrc',
			baseSize: { x: 16, y: 16, z: 0 },
		});
	}
	
}
