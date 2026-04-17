import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { ScaleSettings } from '../cc-entity';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export class Destructible extends DefaultEntity {
	
	public override getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected override async setupType(settings: any): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<DestructibleTypes>('destructible-types.json');
		
		const attributes = this.getAttributes();
		if (attributes['desType']) {
			attributes['desType'].options = {};
			for (const name of Object.keys(types)) {
				attributes['desType'].options[name] = name;
			}
		}
		
		const type = types[settings.desType];
		if (!type) {
			this.generateNoImageType(0xFF0000, 1);
			return;
		}
		
		const anims = Helper.copy(type.anims);

		// frame 1 is always glow, don't show in map editor
		if (Array.isArray(anims.SUB)) {
			anims.SUB = anims.SUB.filter(sub => sub.frames?.[0] !== 1);
		}

		// sheet src is null in json; CrossCode fills it from the current map's destruct style.
		const ok = await this.applyAnims(anims, undefined, settings.desType, 'destruct');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = type.size;
		this.updateSettings();
	}
	
}

interface DestructibleTypes {
	[name: string]: DestructibleType;
}

interface DestructibleType {
	hitCount: number;
	size: Point3;
	anims: Anims;
	preBoom?: SheetReference;
	boom?: SheetReference;
	debris?: SheetReference;
	hitSide?: [0 | 1, 0 | 1, 0 | 1, 0 | 1];
	hitSound?: unknown;
	terrain?: number;
	debrisAngle?: number;
	keyConsume?: string;
	range?: {
		key: string;
		delay: number;
		padding: number;
		startDelay?: number;
	};
}

export interface SheetReference {
	sheet: string;
	name: string;
}
