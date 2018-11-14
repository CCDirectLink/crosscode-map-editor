import {CCEntity, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';

interface CharacterSettings {
	jsonINSTANCE?: string;
	gender?: string;
	img?: string;
	x?: number;
	y?: number;
	offlineX?: number;
	offlineY?: number;
	face?: string;
	runSrc?: string;
	runX?: number;
	runY?: number;
}

export class NPC extends CCEntity {
	
	private attributes = {
		characterName: {
			type: 'Character',
			description: 'Character of NPC',
			ah: 'Character'
		},
		npcStates: {
			type: 'NPCStates',
			description: 'Different states of the NPC',
			uc: true
		},
		analyzable: {
			type: 'Analyzable',
			description: 'Analyzable if any.',
			yka: true,
			I: true,
			uc: true
		},
		hideCondition: {
			type: 'VarCondition',
			description: 'Condition for entity to become transparent',
			I: true,
			dv: 70
		}
	};
	
	private NPCAvatarSimple = {
		width: 32,
		height: 40,
		sprites: {
			normal: {
				default: {x: 1, y: 2, offsetY: -2},
				NORTH: {x: 1, y: 0, offsetY: -2},
				EAST: {x: 1, y: 1, offsetY: -2},
				SOUTH: {x: 1, y: 2, offsetY: -2},
				WEST: {x: 1, y: 1, offsetY: -2, flipX: true},
			},
			ground: {
				default: {x: 0, y: 3, offsetY: 2},
				WEST: {x: 0, y: 3, offsetY: 2, flipX: true}
			}
		}
	};
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return undefined;
	}
	
	protected setupType(settings: any) {
		const splitted = settings.characterName.split('.');
		const name = splitted.splice(-1, 1)[0];
		Helper.getJson('data/characters/' + splitted.join('/') + '/' + name, (charSettings: CharacterSettings) => {
			if (charSettings.jsonINSTANCE === 'NPCAvatarSimple') {
				const img = charSettings.img;
				this.anchor.set(0.5, 1);
				const state = settings.npcStates[0] || {};
				const npc = this.NPCAvatarSimple;
				const config = npc.sprites[state.config];
				if (!config) {
					throw new Error('unknown NPCAvatarSimple config: ' + state.config);
				}
				const offset = config[state.face] || config.default;
				
				this.entitySettings = <any>{
					sheets: {
						fix: [{
							gfx: charSettings.img,
							x: npc.width * offset.x + charSettings.x,
							y: npc.height * offset.y + charSettings.y,
							offsetY: offset.offsetY || 0,
							w: npc.width,
							h: npc.height,
							flipX: offset.flipX || false
						}]
					},
					baseSize: {x: 12, y: 12, z: 28}
				};
				this.updateSettings();
			} else {
				console.error('npc type not implemented with name ' + settings.name);
				this.generateNoImageType(255, 0, 0, 1);
			}
		});
	}
}
