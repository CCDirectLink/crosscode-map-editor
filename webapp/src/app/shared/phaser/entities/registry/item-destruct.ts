import {CCEntity, EntityAttributes, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';

export class ItemDestruct extends CCEntity {
	
	private attributes: EntityAttributes = {
		desType: {
			type: 'String',
			description: 'Type of destructible object',
			Yi: true
		},
		__GLOBAL__: {
			type: 'String',
			description: 'Global settings for destructible object',
			Yi: true
		},
		items: {
			type: 'ItemsDropRate',
			description: 'Items dropped',
			bd: true
		},
		perma: {
			type: 'Boolean',
			description: 'True if cannot be respawned',
			default: 'false',
			R: true
		},
		trigger: {
			type: 'String',
			description: 'var tp set to true once the prop has been destroyed. Only works once.',
			R: true
		},
		enemyInfo: {
			type: 'EnemyType',
			description: 'Enemy to spawn after destruction',
			bd: true,
			Yi: true
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
		const destructibles = this.scene.cache.json.get('destructibles.json');
		let desType;
		if (settings.desType) {
			desType = settings.desType;
		} else {
			const config = globalSettings.ENTITY.ItemDestruct[settings.__GLOBAL__];
			if (config) {
				desType = config.desType;
			}
		}
		if (!desType) {
			this.generateNoImageType(0xFF0000, 1);
			return;
		}
		const def = destructibles[desType];
		const gfx = def.Aa.sheet.src;
		
		const exists = await Helper.loadTexture(gfx, this.scene);
		
		if (!exists) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings = <any>{
			sheets: {
				fix: [{
					gfx: gfx,
					x: def.Aa.sheet.offX,
					y: def.Aa.sheet.offY,
					w: def.Aa.sheet.width,
					h: def.Aa.sheet.height
				}]
			},
			baseSize: def.size
		};
		this.updateSettings();
		
	}
}
