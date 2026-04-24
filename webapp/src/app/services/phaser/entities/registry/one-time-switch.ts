import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface OneTimeSwitchAttributes {
	switchType: string;
	variable?: string;
	addValue?: string;
	activeTime?: number;
	fixCount?: number;
	fastMode?: boolean;
}

interface OneTimeSwitchType {
	size: Point3;
	anims: Anims;
	useStyleSheet?: string;
	collType?: number;
	padding?: { x: number; y: number };
	activeZHeight?: number;
	preStopTime?: number;
	ignoreInvalid?: boolean;
	hideHitEffect?: boolean;
	fx?: Record<string, { sheet: string; name: string }>;
}

type OneTimeSwitchTypes = Record<string, OneTimeSwitchType | undefined>;

const FALLBACK_MAPSTYLE: Record<string, string> = {
	'default': 'puzzle',
	'propeller': 'propeller',
	'steamPipe': 'pipeSwitch',
	'teslaSwitch': 'teslaSwitch',
	'waveSwitch': 'waveSwitch',
};

export class OneTimeSwitch extends DefaultEntity {

	protected override async setupType(settings: OneTimeSwitchAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<OneTimeSwitchTypes>('one-time-switch-types.json');

		const attributes = this.getAttributes();
		attributes['switchType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['switchType'].options[name] = name;
		}

		const type = types[settings.switchType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: type.anims,
			animName: 'off',
			label: `OneTimeSwitch ${settings.switchType}`,
			mapStyle: FALLBACK_MAPSTYLE[settings.switchType],
			baseSize: type.size,
			useStyleSheet: type.useStyleSheet,
		});
	}

}
