import { Helper } from '../../helper';
import { Anims, AnimSheet } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';
import { Point3 } from '../../../../models/cross-code-map';
import { AttributeValue, EntityAttributes } from '../cc-entity';
import { EnemyInfo } from './enemy';
import { SheetReference } from './destructible';
import { GlobalSettings } from '../../global-settings';

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
			__GLOBAL__: null
		};
		return Object.assign(objOrder, attributes);
	}
	
	protected override async setupType(settings: any) {
		const globalSettings = await Helper.getJson('data/global-settings') as GlobalSettings.GlobalSettings;
		let desType = '';
		if (settings.desType) {
			desType = settings.desType;
		} else {
			const config = globalSettings.ENTITY.ItemDestruct[settings.__GLOBAL__];
			if (config) {
				desType = config.desType;
			}
		}
		const destructibles = this.scene.cache.json.get('destructibles.json') as ItemDestructTypes;
		const type = destructibles[desType];
		if (!type) {
			this.generateNoImageType(0xFF0000, 1);
			return;
		}
		const animSheet = type.anims.sheet as AnimSheet;
		const gfx = (typeof animSheet === 'string') ? animSheet : animSheet.src;
		
		const exists = await Helper.loadTexture(gfx, this.scene);
		
		if (!exists) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings = <any>{
			sheets: {
				fix: [{
					gfx: gfx,
					x: animSheet.offX || 0,
					y: animSheet.offY || 0,
					w: animSheet.width || 0,
					h: animSheet.height || 0,
				}]
			},
			baseSize: type.size
		};
		this.updateSettings();
		
	}
}
