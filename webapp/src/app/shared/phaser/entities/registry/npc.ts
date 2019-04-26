import {CCEntity, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';
import {Point3} from '../../../../models/cross-code-map';

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
	walkAnimSet?: {
		normal: {
			idle: string,
			move: string
		}
	};
	
	animSheet?: {
		namedSheets: {
			move?: NamedSheet
			walk?: NamedSheet
		};
		sheet?: NamedSheet,
		DOCTYPE?: string;
		shapeType?: string;
		offset?: Point3;
		SUB?: any;
	};
}

interface NamedSheet {
	src: string;
	width: number;
	height: number;
	xCount: number;
	offX: number;
	offY: number;
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
	
	private NPCSimple = {
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
	
	protected async setupType(settings: any) {
		
		const charSettings: CharacterSettings = await Helper.getJsonPromise(this.getPath('data/characters/', settings.characterName));
		const state = settings.npcStates[0] || {};
		const npc = this.NPCSimple;
		let config = npc.sprites[state.config];
		if (!config) {
			console.error('unknown npc config: [' + state.config + '], using default');
			console.error('char settings', charSettings);
			config = npc.sprites.normal;
		}
		let offset = config[state.face] || config.default;
		
		let width = npc.width;
		let height = npc.height;
		let src = charSettings.img;
		let x = charSettings.x || 0;
		let y = charSettings.y || 0;
		if (charSettings.animSheet) {
			if (typeof charSettings.animSheet === 'string') {
				// sheet is only reference
				charSettings.animSheet = await Helper.getJsonPromise(this.getPath('data/animations/', charSettings.animSheet));
			}
			if (charSettings.animSheet.sheet) {
				// sheet exists, test how to get proper offset
				console.group('sheet exists for ' + settings.characterName);
				console.warn(settings);
				console.warn('assuming no offset, check if this is correct');
				console.groupEnd();
				offset = {x: 0, y: 0};
			}
			const sheets = charSettings.animSheet.namedSheets || {};
			let sheet = sheets.move || sheets.walk || charSettings.animSheet.sheet;
			if (!sheet) {
				let key;
				
				if (charSettings.walkAnimSet) {
					// try to get sheet through walkAnimSet
					const animKey = charSettings.walkAnimSet.normal.idle;
					for (let i = 0; i < charSettings.animSheet.SUB.length; i++) {
						const sub = charSettings.animSheet.SUB[i];
						const privateKey = sub.sheet;
						if (!sub.SUB) {
							continue;
						}
						if (sub.SUB.some(sheet => sheet.name === animKey)) {
							key = privateKey;
							break;
						}
					}
				}
				
				if (!key) {
					// no key found, use anything so the npc is not invisible
					key = Object.keys(sheets)[0];
					console.warn('key not found, used [' + key + '] instead', charSettings);
				}
				sheet = sheets[key];
			}
			
			width = sheet.width || width;
			height = sheet.height || height;
			src = sheet.src || src;
			x = sheet.offX || x;
			y = sheet.offY || y;
			
			src = src.trim();
		}
		
		this.anchor.set(0.5, 1);
		this.entitySettings = <any>{
			sheets: {
				fix: [{
					gfx: src,
					x: width * offset.x + x,
					y: height * offset.y + y,
					offsetX: offset.offsetX || 0,
					offsetY: offset.offsetY || 0,
					w: width,
					h: height,
					flipX: offset.flipX || false,
					flipY: offset.flipY || false
				}]
			},
			baseSize: {x: 12, y: 12, z: 28}
		};
		await this.updateSettings();
	}
	
	private getPath(prefix, path): string {
		const split = path.split('.');
		const name = split.splice(-1, 1)[0];
		return prefix + split.join('/') + '/' + name;
	}
}
