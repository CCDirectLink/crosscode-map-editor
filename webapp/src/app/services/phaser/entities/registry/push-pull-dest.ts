import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface PushPullDestAttributes {
	pushPullDestType: string;
	zMove?: number;
	saveType?: string;
	variable?: string;
}

export class PushPullDest extends DefaultEntity {
	
	protected override async setupType(settings: PushPullDestAttributes): Promise<void> {
		const type = PUSH_PULL_DEST_TYPES[settings.pushPullDestType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			sheet: {
				mapStyle: 'puzzle',
				width: 32,
				height: 32,
				offX: type.offX,
				offY: type.offY,
			},
			aboveZ: 1,
			SUB: [{ name: 'default', frames: [0] }],
		};
		
		await this.applyAnims({
			anims,
			label: settings.pushPullDestType,
			baseSize: { x: 32, y: 32, z: 0 },
		});
	}
	
}

const PUSH_PULL_DEST_TYPES: Record<string, { offX: number; offY: number } | undefined> = {
	DEFAULT: { offX: 224, offY: 96 },
};
