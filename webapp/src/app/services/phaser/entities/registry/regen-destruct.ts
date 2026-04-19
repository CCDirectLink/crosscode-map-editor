import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { ScaleSettings } from '../cc-entity';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface RegenDestructAttributes {
	desType: string;
}

interface RegenDestructType {
	size: Point3;
	anims: Anims;
}

type RegenDestructTypes = Record<string, RegenDestructType | undefined>;

export class RegenDestruct extends DefaultEntity {

	public override getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}

	protected override async setupType(settings: RegenDestructAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<RegenDestructTypes>('regen-destruct-types.json');

		const attributes = this.getAttributes();
		if (attributes['desType']) {
			attributes['desType'].options = {};
			for (const name of Object.keys(types)) {
				attributes['desType'].options[name] = name;
			}
		}

		const type = types[settings.desType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: type.anims,
			animName: 'default',
			label: `RegenDestruct ${settings.desType}`,
			mapStyle: 'destruct',
			baseSize: type.size,
		});
	}

}
