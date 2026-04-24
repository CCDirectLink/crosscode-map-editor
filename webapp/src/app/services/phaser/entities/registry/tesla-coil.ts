import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface TeslaCoilAttributes {
	coilType: string;
	varOnCharge?: string;
	varOnDischarge?: string;
	align?: string;
}

export class TeslaCoil extends DefaultEntity {

	protected override async setupType(settings: TeslaCoilAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<TeslaCoilTypes>('tesla-coil-type.json');

		const attributes = this.getAttributes();
		attributes['coilType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['coilType'].options[name] = name;
		}

		const type = types[settings.coilType] ?? types['SOURCE'];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: type.anims,
			animName: 'off',
			label: settings.coilType,
			mapStyle: 'tesla',
			baseSize: type.size,
		});
	}

}

interface TeslaCoilTypes {
	[name: string]: TeslaCoilType;
}

interface TeslaCoilType {
	size: Point3;
	collType?: number;
	source?: boolean;
	fast?: boolean;
	anims: Anims;
}
