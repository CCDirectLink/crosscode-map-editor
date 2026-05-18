import { NPCState, NPCStatesWidgetComponent } from '../../../../components/widgets/npc-states-widget/npc-states-widget.component';
import { Point, Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { DefaultEntity } from './default-entity';
import { Label } from '../../../../models/events';
import { Anims, IfThen, prepareSheet, SubJsonParam } from '../../sheet-parser';
import { getNPCTemplates } from './npc-templates';
import { resolveDirIndex } from './direction';

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

		charSettings.jsonTEMPLATES = await getNPCTemplates();
		charSettings = prepareSheet(charSettings);
		delete charSettings.jsonTEMPLATES;

		const animSheet = charSettings.animSheet;
		if (!animSheet || typeof animSheet === 'string' || !Array.isArray(animSheet.SUB)) {
			console.warn(`animSheet broken for character: [${settings.characterName}]`);
			this.generateErrorImage();
			return;
		}

		const state = settings.npcStates?.[0] ?? {};
		const config = state.config || 'normal';
		const face = state.face || 'NORTH';

		const walkAnims = charSettings.configs?.[config]?.walkAnims ?? charSettings.walkAnims ?? 'normal';
		const animSet = charSettings.walkAnimSet?.[walkAnims] ?? Object.values(charSettings.walkAnimSet ?? {})[0];
		const animName = (animSet?.['idle'] ?? animSet?.['move'] ?? Object.values(animSet ?? {})[0]) as string | undefined;

		const baseSize: Point3 = charSettings.size ?? {x: 12, y: 12, z: 28};

		const shadowSize = charSettings.configs?.[config]?.shadow ?? charSettings.shadow ?? 16;
		if (shadowSize > 0) {
			animSheet.shadow = {size: shadowSize, scaleY: charSettings.shadowScaleY};
		}

		await this.applyAnims({
			anims: animSheet,
			animName: animName,
			label: settings.characterName,
			baseSize: baseSize,
			dirIndex: resolveDirIndex(animSheet, face, animName),
		});
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
