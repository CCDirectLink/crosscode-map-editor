import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface BounceBlockAttributes {
	blockType: string;
	group?: string;
	action?: unknown;
	ballTime?: number;
}

export class BounceBlock extends DefaultEntity {

	protected override async setupType(settings: BounceBlockAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<BounceBlockTypes>('bounce-block-types.json');
		
		const attributes = this.getAttributes();
		attributes['blockType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['blockType'].options[name] = name;
		}
		
		const type = types[settings.blockType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const ok = await this.applyAnims(type.anims, undefined, settings.blockType, 'puzzle2');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = type.size;
		this.updateSettings();
	}
	
}

interface BounceBlockTypes {
	[name: string]: BounceBlockType;
}

interface BounceBlockType {
	size: Point3;
	shape: string;
	anims: Anims;
}
