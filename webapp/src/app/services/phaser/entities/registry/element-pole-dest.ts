import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

const ELEMENT_INDEX: Record<string, number | undefined> = {
	HEAT: 1,
	COLD: 2,
	SHOCK: 3,
	WAVE: 4,
};

export interface ElementPoleDestAttributes {
	group?: string;
	element: string;
	variable?: string;
	activeTime?: number;
}

export class ElementPoleDest extends DefaultEntity {
	
	protected override async setupType(settings: ElementPoleDestAttributes): Promise<void> {
		const elementIndex = ELEMENT_INDEX[settings.element];
		if (!elementIndex) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			sheet: { mapStyle: 'puzzle2', width: 16, height: 16, offX: 0, offY: 240 },
			SUB: [{
				frames: [0],
				SUB: [{ name: 'on' }],
			}, {
				tileOffset: elementIndex * 2 - 1,
				frames: [1],
				SUB: [{ name: 'on' }],
			}],
		};
		
		const ok = await this.applyAnims(anims, 'on', 'ElementPoleDest', 'puzzle2');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = { x: 16, y: 16, z: 0 };
		this.updateSettings();
	}
	
}
