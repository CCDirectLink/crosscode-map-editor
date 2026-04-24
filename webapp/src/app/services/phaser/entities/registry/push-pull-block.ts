import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface PushPullBlockAttributes {
	pushPullType: string;
	spawnCondition?: unknown;
}

interface PushPullBlockTypes {
	[name: string]: PushPullBlockType;
}

interface PushPullBlockType {
	size: Point3;
	terrain: number;
	direction?: number;
	useStyleSheet?: boolean;
	anims: Anims;
}


export class PushPullBlock extends DefaultEntity {

	protected override async setupType(settings: PushPullBlockAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<PushPullBlockTypes>('push-pull-types.json');

		const attributes = this.getAttributes();
		attributes['pushPullType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['pushPullType'].options[name] = name;
		}

		const type = types[settings.pushPullType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: type.anims,
			label: settings.pushPullType,
			mapStyle: 'puzzle',
			baseSize: type.size,
		});
	}

}

