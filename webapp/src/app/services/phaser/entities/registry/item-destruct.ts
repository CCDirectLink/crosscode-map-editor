import { Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { CCEntity, EntityAttributes, ScaleSettings } from '../cc-entity';
import { Anims, AnimSheet } from '../../sheet-parser';

export class ItemDestruct extends CCEntity {
	
	private attributes: EntityAttributes = {
		desType: {
			type: 'String',
			description: 'Type of destructible object',
			withNull: true
		},
		__GLOBAL__: {
			type: 'String',
			description: 'Global settings for destructible object',
			withNull: true
		},
		items: {
			type: 'ItemsDropRate',
			description: 'Items dropped',
		},
		perma: {
			type: 'Boolean',
			description: 'True if cannot be respawned',
			default: 'false',
			optional: true
		},
		trigger: {
			type: 'String',
			description: 'var tp set to true once the prop has been destroyed. Only works once.',
			optional: true
		},
		enemyInfo: {
			type: 'EnemyType',
			description: 'Enemy to spawn after destruction',
			popup: true,
			withNull: true
		}
	};
	
	public getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected async setupType(settings: any) {
		const globalSettings = await Helper.getJsonPromise('data/global-settings') as any;
		let desType;
		if (settings.desType) {
			desType = settings.desType;
		} else {
			const config = globalSettings.ENTITY.ItemDestruct[settings.__GLOBAL__];
			if (config) {
				desType = config.desType;
			}
		}
		const destructibles = this.scene.cache.json.get('destructibles.json') as ItemDestructTypes;
		this.attributes['desType'].options = {};
		for (const name of Object.keys(destructibles)) {
			this.attributes['desType'].options[name] = name;
		}
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

interface ItemDestructTypes {
	[name: string]: ItemDestructType;
}

interface ItemDestructType {
	size: Point3;
	anims: Anims;
}
