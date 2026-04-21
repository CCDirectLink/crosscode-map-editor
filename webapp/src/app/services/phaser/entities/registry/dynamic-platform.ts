import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface DynamicPlatformAttributes {
	platformType: string;
	states?: unknown;
	pauseCondition?: string;
	pauseAnimation?: unknown;
	skipWait?: boolean;
	spawnCondition?: string;
}


interface DynamicPlatformTypes {
	[name: string]: DynamicPlatformType | undefined;
}

interface DynamicPlatformType {
	size: Point3;
	styleKey?: string;
	terrain: number;
	shadowSize?: number;
	anims: Anims;
	walkAnims: Record<string, Record<string, string>>;
	fx?: Record<string, { sheet: string; name: string }>;
}


export class DynamicPlatform extends DefaultEntity {

	protected override async setupType(settings: DynamicPlatformAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<DynamicPlatformTypes>('dynamic-platform-types.json');

		const attributes = this.getAttributes();
		attributes['platformType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['platformType'].options[name] = name;
		}

		const type = types[settings.platformType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: type.anims,
			label: settings.platformType,
			mapStyle: type.styleKey,
			baseSize: type.size,
		});
	}

}
