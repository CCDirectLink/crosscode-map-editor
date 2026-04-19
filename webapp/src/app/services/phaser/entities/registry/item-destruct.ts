import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { Point3 } from '../../../../models/cross-code-map';
import { EntityAttributes } from '../cc-entity';
import { EnemyInfo } from './enemy';
import { SheetReference } from './destructible';
import { GlobalSettings } from '../../global-settings';
import { Globals } from '../../../globals';

export interface ItemDestructTypes {
	[name: string]: ItemDestructType;
}

export interface ItemDestructType {
	size: Point3;
	effectOffset: Point3;
	boom: SheetReference;
	debris: SheetReference;
	anims: Anims;
	gravity?: number;
}

export interface ItemDestructAttributes {
	desType?: string;
	__GLOBAL__?: string;
	items?: unknown;
	perma?: boolean;
	indest?: boolean;
	trigger?: string;
	increment?: string;
	enemyInfo?: EnemyInfo;
}

export class ItemDestruct extends DefaultEntity {
	
	override getAttributes(): EntityAttributes {
		const attributes = super.getAttributes();
		attributes['desType'].type = 'CustomDesType';
		attributes['__GLOBAL__'] = {
			type: 'String',
			description: 'Global settings for destructible object',
		};
		const objOrder: { [key in keyof ItemDestructAttributes]: null } = {
			desType: null,
			__GLOBAL__: null,
		};
		return Object.assign(objOrder, attributes);
	}
	
	protected override async setupType(settings: any) {
		const globalSettings = await Helper.getJsonPromise('data/global-settings') as GlobalSettings.GlobalSettings;
		let desType = '';
		if (settings.desType) {
			desType = settings.desType;
		} else {
			const config = globalSettings.ENTITY.ItemDestruct[settings.__GLOBAL__];
			if (config) {
				desType = config.desType;
			}
		}
		const destructibles = await Globals.jsonLoader.loadJsonMerged<ItemDestructTypes>('destructibles.json');
		const type = destructibles[desType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		
		// only frame 1 is relevant
		let anims = type.anims;
		if (Array.isArray(anims.SUB) && anims.SUB.length > 1) {
			anims = { ...type.anims, SUB: anims.SUB.slice(0, 1) };
		}
		
		await this.applyAnims({
			anims,
			label: desType,
			baseSize: type.size,
		});
	}
}
