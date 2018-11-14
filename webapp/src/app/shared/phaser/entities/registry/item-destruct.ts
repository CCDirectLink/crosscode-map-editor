import {CCEntity, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';
import {PropDef} from './prop';
import * as Phaser from 'phaser-ce';

export class ItemDestruct extends CCEntity {
	
	private attributes = {
		desType: {
			type: 'String',
			description: 'Type of destructible object',
			options: null,
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
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return undefined;
	}
	
	protected setupType(settings: any) {
		Helper.getJson('data/global-settings', (globalSettings) => {
			const destructibles = this.game.cache.getJSON('destructibles.json');
			let desType;
			if (settings.desType) {
				desType = settings.desType;
			} else {
				desType = globalSettings.ENTITY.ItemDestruct[settings.__GLOBAL__].desType;
			}
			const def = destructibles[desType];
			this.anchor.set(0.5, 1);
			this.entitySettings = <any>{
				sheets: {
					fix: [{
						gfx: def.Aa.sheet.src,
						x: def.Aa.sheet.offX,
						y: def.Aa.sheet.offY,
						w: def.Aa.sheet.width,
						h: def.Aa.sheet.height
					}]
				},
				baseSize: def.size
			};
			this.updateSettings();
		});
	}
}
