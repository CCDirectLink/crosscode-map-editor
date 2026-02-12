import { NPCState, NPCStatesWidgetComponent } from '../../../../components/widgets/npc-states-widget/npc-states-widget.component';
import { Point, Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { DefaultEntity } from './default-entity';
import { Label } from '../../../../models/events';
import { Anims, flattenSUBs, IfThen, prepareSheet, SubJsonParam } from '../../sheet-parser';
import { getNPCTemplates } from './npc-templates';
import { Globals } from '../../../globals';

export interface CharacterSettings {
	jsonINSTANCE?: string;
	jsonTEMPLATES?: any;
	name?: Label;
	img?: string;
	x?: number;
	y?: number;
	face?: Face | null | string;
	animSheet?: Anims | string;
	walkAnimSet?: WalkAnimSet;
	walkAnims?: string;
	configs?: Configs;
	gender?: string;
	size?: Point3;
	shadow?: number;
	floatHeight?: number;
	floatVariance?: number;
	realname?: Label;
	sitX?: number;
	sitY?: number;
	displayOffset?: Point;
	relativeVel?: number;
	collType?: string;
	width?: number;
	height?: number;
	sit2X?: number;
	sit2Y?: number;
	offlineX?: number;
	offlineY?: number;
	runSrc?: string;
	runX?: number;
	runY?: number;
	zGravityFactor?: number;
	shadowScaleY?: number;
	terrain?: string;
	soundType?: string;
	shadowType?: string;
}

export interface Face {
	[key: number]: string | undefined;
	
	width?: number;
	height?: number;
	centerX?: number;
	centerY?: number;
	src?: string;
	parts?: Part[];
	expressions?: Expressions;
	ABSTRACT?: string | SubJsonParam;
	subImages?: Record<string, string>;
}

export type Part = Record<string, DetailPart | number>;

export type Expressions = Record<string, Faces>;

export interface Faces {
	faces: string[][];
}

export interface DetailPart {
	srcX: number;
	srcY: number;
	width: number;
	height: number;
	destX: number;
	destY: number;
	subX?: number;
	subY?: number;
	img?: string;
	hideOnClip?: boolean;
}

export type WalkAnimSet = Record<string, Record<string, string | WalkAnimSetInner | undefined> | undefined>;


export interface WalkAnimSetInner extends IfThen {
	[key: string]: string | undefined;
}


export type Configs = Record<string, ConfigSet>;

export interface ConfigSet {
	relativeVel?: number;
	walkAnims?: string;
	collType?: string;
	floatHeight?: number;
	floatVariance?: number;
	floatAccel?: number;
	ignoreCollision?: boolean;
	zGravityFactor?: number;
	shadow?: number;
	sizeOverride?: Partial<Point3>;
	jsonIF?: string;
}

export const FACE4 = {
	NORTH: 0,
	EAST: 1,
	SOUTH: 2,
	WEST: 3,
};

export const FACE8 = {
	NORTH: 0,
	NORTH_EAST: 1,
	EAST: 2,
	SOUTH_EAST: 3,
	SOUTH: 4,
	SOUTH_WEST: 5,
	WEST: 6,
	NORTH_WEST: 7
};


export interface NpcAttributes {
	characterName?: string;
	npcStates?: Partial<NPCState>[];
	analyzable?: Analyzable;
	hideCondition?: string;
}

export interface Analyzable {
	text?: Label;
	active?: boolean;
}

export class NPC extends DefaultEntity {
	
	protected override async setupType(settings: NpcAttributes) {
		
		let charSettings = await Helper.getJsonPromise(this.getPath('data/characters/', settings.characterName)) as CharacterSettings | undefined;
		if (!charSettings) {
			console.warn(`no char settings found for character name: [${settings.characterName}]`);
			this.generateNoImageType();
			return;
		}
		if (typeof charSettings.animSheet === 'string') {
			const path = this.getPath('data/animations/', charSettings.animSheet);
			charSettings.animSheet = await Helper.getJsonPromise(path) as Anims;
			if (!charSettings.animSheet) {
				throw new Error('no anim sheet found for: ' + charSettings.animSheet + ' in path: ' + path);
			}
		}
		
		charSettings.jsonTEMPLATES = getNPCTemplates();
		charSettings = prepareSheet(charSettings);
		delete charSettings.jsonTEMPLATES;
		
		if (typeof charSettings.animSheet === 'string') {
			throw new Error('should never be string');
		}
		
		const state = settings.npcStates?.[0] ?? {};
		const config = state.config ?? 'normal';
		const face = state.face || 'SOUTH';
		const walkAnims = charSettings.configs?.[config]?.walkAnims ?? 'normal';
		const animSet = charSettings.walkAnimSet?.[walkAnims] || Object.values(charSettings.walkAnimSet ?? {})[0];
		
		const usedSet = animSet?.['idle'] || animSet?.['move'] || Object.values(animSet ?? {})[0];
		
		const subName = usedSet as string;
		
		
		if (!Array.isArray(charSettings.animSheet?.SUB)) {
			console.warn(`animSheet is not an array, abort: [${settings.characterName}]`);
			this.generateNoImageType();
			return;
		}
		const subs = flattenSUBs(charSettings.animSheet!, {});
		
		let sub = subs.find(v => v.name === subName);
		if (!sub) {
			sub = subs[0];
		}
		const sheet = sub.namedSheets?.[sub.sheet as string] ?? sub.sheet;
		if (!sheet || typeof sheet === 'string') {
			this.generateErrorImage();
			return;
		}
		const exists = await Helper.loadTexture(sheet?.src, this.scene);
		
		if (!exists) {
			this.generateErrorImage();
			return;
		}
		
		let x = sheet.offX ?? 0;
		let y = sheet.offY ?? 0;
		let flipX = false;
		
		let dirIndex = 0;
		const subDirs = typeof sub.dirs === 'string' ? parseInt(sub.dirs, 10) : sub.dirs;
		if (subDirs === 8) {
			dirIndex = FACE8[face];
		} else if (subDirs === 4) {
			dirIndex = FACE4[face as keyof typeof FACE4];
		}
		
		const img = Globals.scene.textures.get(sheet.src).getSourceImage();
		const xCount = sheet.xCount ?? img.width / sheet.width;
		
		// flip x with some serious type checking
		if (sub.flipX) {
			if (typeof sub.flipX === 'boolean') {
				flipX = sub.flipX;
			} else {
				const flipXNum = sub.flipX?.[dirIndex];
				if (typeof flipXNum === 'number') {
					flipX = !!flipXNum;
				}
			}
		}
		
		const tileOffsets = sub.tileOffsets;
		const idleFrame = sub.frames?.[0] ?? 0;
		const offset = (tileOffsets?.[dirIndex] ?? 0) + idleFrame;
		
		x += (offset % xCount) * sheet.width;
		y += Math.floor(offset / xCount) * sheet.height;
		
		this.entitySettings.sheets = {
			fix: [{
				gfx: sheet?.src,
				x: x,
				y: y,
				w: sheet?.width ?? 16,
				h: sheet?.height ?? 16,
				flipX: flipX,
				flipY: false
			}]
		};
		this.entitySettings.baseSize = {x: 12, y: 12, z: 28};
		this.updateSettings();
	}
	
	private getPath(prefix: string, path?: string): string {
		if (!path) {
			path = '';
		}
		const split = path.split('.');
		const name = split.splice(-1, 1)[0];
		return prefix + split.join('/') + '/' + name;
	}
	
	
	public override doubleClick(): void {
		(this.widgets['npcStates'] as NPCStatesWidgetComponent).open();
	}
}
