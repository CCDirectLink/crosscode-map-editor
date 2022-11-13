import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { CCEntity, EntityAttributes, Fix, ScaleSettings } from '../cc-entity';
import { Anims, AnimSheet } from './prop';

export class Destructible extends CCEntity {
	private attributes: EntityAttributes = {
		desType: {
			type: 'String',
			description: 'Type of destructible object',
			withNull: true,
		},
		enemyInfo: {
			type: 'EnemyType',
			description: 'Enemy to spawn after destruction',
			withNull: true,
		},
		spawnCondition: {
			type: 'VarCondition',
			description: 'Condition for Enemy to spawn',
		},
		blockNavMap: {
			type: 'Boolean',
			description: 'If true, block path map and update when destroyed',
		},
		permaDestruct: {
			type: 'Boolean',
			description: 'If true, then destructible stays destroyed after reentering map',
		},
		onDestructIncrease: {
			type: 'VarName',
			description: 'Variable to increase by one when destroyed',
		},
		onPreDestructIncrease: {
			type: 'VarName',
			description: 'Variable to increase by one when destroyed'
		}
	};
	
	public getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	public getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected async setupType(settings: any): Promise<void> {
		const types = this.scene.cache.json.get('destructible-types.json') as DestructibleTypes;
		
		this.attributes.desType.options = {};
		for (const name of Object.keys(types)) {
			this.attributes.desType.options[name] = name;
		}
		
		const type = types[settings.desType];
		if (!type) {
			this.generateNoImageType(0xFF0000, 1);
			return;
		}
		
		const sheets: Fix[] = [];
		const defaultSheet = type.anims.sheet as AnimSheet;
		
		for (const sub of type.anims.SUB) {
			const sheet = defaultSheet || type.anims.namedSheets[sub.sheet!];
			let frame = sub.frames ? sub.frames[0] : 0;
			
			// frame 1 is always glow, don't show in map editor
			if (frame === 1) {
				frame = 0;
			}
			
			const offset = {
				x: 0,
				y: 0
			};
			if (type.anims.offset) {
				offset.x = type.anims.offset.x;
				offset.y = type.anims.offset.y;
			}
			const xCount = sheet.xCount || 999;
			const xOffset = (frame % xCount) * sheet.width;
			const yOffset = Math.floor(frame / xCount) * sheet.height;
			sheets.push({
				gfx: sheet.src,
				x: (sheet.offX || 0) + xOffset,
				y: (sheet.offY || 0) + yOffset,
				w: sheet.width,
				h: sheet.height,
				offsetX: offset.x,
				offsetY: offset.y,
				renderMode: sub.renderMode
			});
		}
		
		this.entitySettings = <any>{
			sheets: {
				fix: sheets,
			},
			baseSize: type.size,
		};
		
		const mapStyle = Helper.getMapStyle(Globals.map, 'destruct');
		for (const sheet of sheets) {
			if (!sheet.gfx) {
				sheet.gfx = mapStyle.sheet;
			}
			const exists = await Helper.loadTexture(sheet.gfx, this.scene);
			if (!exists) {
				console.error('sheet does not exist: ' + sheet.gfx);
			}
		}
		
		if (sheets.length === 0) {
			this.generateErrorImage();
		}
		
		this.updateSettings();
	}
	
}

interface DestructibleTypes {
	[name: string]: DestructibleType;
}

interface DestructibleType {
	hitCount: number;
	size: Point3;
	anims: Anims;
	preBoom?: SheetReference;
	boom?: SheetReference;
	debris?: SheetReference;
	hitSide?: [0 | 1, 0 | 1, 0 | 1, 0 | 1];
	hitSound?: unknown;
	terrain?: number;
	debrisAngle?: number;
	keyConsume?: string;
	range?: {
		key: string;
		delay: number;
		padding: number;
		startDelay?: number;
	};
}

interface SheetReference {
	sheet: string;
	name: string;
}
