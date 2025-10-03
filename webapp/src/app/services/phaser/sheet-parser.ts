import { Point, Point3 } from '../../models/cross-code-map';
import { Fix } from './entities/cc-entity';
import { CharacterSettings } from './entities/registry/npc';
import { ScalablePropDef } from './entities/registry/scalable-prop';
import { Helper } from './helper';

export interface ScalablePropSheet {
	DOCTYPE: string;
	entries: Record<string, ScalablePropDef>;
	jsonTEMPLATES?: Record<string, ScalablePropDef>;
}

export interface PropSheet {
	DOCTYPE: string;
	props: PropDef[];
	jsonTEMPLATES?: JsonTemplates;
}

export type JsonTemplates = Record<string, Anims | Anims[keyof Anims]>;

export interface PropDef {
	name?: string;
	terrain?: string;
	size: Point3;
	collType: string;
	fix?: Fix;
	shapeType?: string;
	effects?: Effects;
	anims?: Anims;
	nudging?: boolean;
	'nudge-variance'?: number;
	tags?: string;
	sequence?: Sequence;
	shuffleAnims?: boolean;
	ballKill?: BallKill;
	shadow?: number;
	floatHeight?: number;
	floatVariance?: number;
	shape?: string;
}

export interface Effects {
	sheet: string;
	show?: string;
	hide?: string;
}

export interface Sequence {
	sheet: SequenceSheet;
	entries: Entry[];
}

export interface SequenceSheet {
	gfx: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Entry {
	name: string;
	size?: Point3;
	wallY?: number;
}

export interface Anims extends IfThen {
	name?: string;
	frames?: number[];
	time?: number;
	repeat?: boolean;
	sheet?: AnimSheet | string;
	renderMode?: string;
	shapeType?: string;
	framesAlpha?: number[];
	flipX?: boolean | number[];
	SUB?: Anims[] | SubJsonInstance | SubJsonParam;
	tileOffset?: number;
	wallY?: number;
	offset?: Partial<Point3>;
	shape?: string;
	framesGfxOffset?: number[];
	size?: Point3;
	pivot?: Point;
	gfxOffset?: Partial<Point>;
	aboveZ?: number;
	offX?: number;
	namedSheets?: Record<string, AnimSheet>;
	framesSpriteOffset?: number[];
	globalTiming?: boolean;

	// used in NPC
	DOCTYPE?: string;
	dirs?: number | string;
	tileOffsets?: number[];
	guiSprites?: boolean;
}

export interface IfThen {
	jsonIF?: string;
	jsonTHEN?: string;
}

export interface AnimSheet {
	src: string;
	width: number;
	height: number;
	offX?: number;
	offY?: number;
	xCount?: number;
}

export interface SubJsonInstance {
	jsonINSTANCE: keyof JsonTemplates;
}

export interface SubJsonParam {
	jsonPARAM: string;

	// can't find any usages of it, but code references it
	default?: any;
}

export interface BallKill {
	fx: Effect;
}

export interface Effect {
	sheet: string;
	name: string;
}

export function isJsonInstance(obj: any): obj is SubJsonInstance {
	const key: keyof SubJsonInstance = 'jsonINSTANCE';
	return obj && obj[key];
}

export function isJsonParam(obj: any): obj is SubJsonParam {
	const key: keyof SubJsonParam = 'jsonPARAM';
	return obj && obj[key];
}

export function prepareSheet<
	T extends PropSheet | ScalablePropSheet | CharacterSettings,
>(sheetDef: T): T {
	const sheet = Helper.copy(sheetDef);
	return recSearchTemplateInstance(sheet, sheet.jsonTEMPLATES, {});
}

export function prepareProp(propDef: PropDef, sheetDef: PropSheet): Anims {
	return recSearchTemplateInstance(
		Helper.copy(propDef.anims),
		sheetDef.jsonTEMPLATES,
		{},
	);
}

export function prepareScalableProp(
	propDef: ScalablePropDef,
	sheetDef: ScalablePropSheet,
): ScalablePropDef {
	return recSearchTemplateInstance(
		Helper.copy(propDef),
		sheetDef.jsonTEMPLATES,
		{},
	);
}

function recSearchTemplateInstance(
	json: Anims | Anims[keyof Anims],
	templates?: JsonTemplates,
	tmpTemplates?: JsonTemplates,
) {
	if (!json || typeof json != 'object') {
		return json;
	}
	if (isJsonInstance(json)) {
		return resolveTemplateInstance(json, templates!, tmpTemplates!);
	}
	if (json instanceof Array) {
		for (let i = 0; i < json.length; i++) {
			json[i] = recSearchTemplateInstance(
				json[i],
				templates,
				tmpTemplates,
			);
		}
		return json;
	}
	for (const key of Object.keys(json)) {
		//@ts-expect-error no index signature
		json[key] = recSearchTemplateInstance(
			//@ts-expect-error no index signature
			json[key],
			templates,
			tmpTemplates,
		);
	}

	return json;
}

function resolveTemplateInstance(
	instanceData: SubJsonInstance,
	templates: JsonTemplates,
	tmpTemplates: JsonTemplates,
) {
	const templateName = instanceData.jsonINSTANCE;
	const template = tmpTemplates[templateName] || templates[templateName];
	if (!template) {
		console.error("Could not find template '" + templateName + "'");
		return;
	}
	return recResolveTemplateInstance(
		template,
		instanceData,
		templates,
		tmpTemplates,
	);
}

function recResolveTemplateInstance(
	template: JsonTemplates[''],
	instanceData: any,
	templates: JsonTemplates,
	tmpTemplates: JsonTemplates,
): any {
	if (!template || typeof template != 'object') {
		return template;
	}

	if (isJsonInstance(template)) {
		const templateCopy = Helper.copy(template);
		return resolveTemplateInstance(templateCopy, templates, tmpTemplates);
	}

	if (isJsonParam(template)) {
		let value = instanceData[template['jsonPARAM']];

		if (value === undefined || value === null) {
			if (template['default'] !== undefined) {
				value = template['default'];
			} else {
				throw new Error(
					"Could not find template parameters '" +
						template['jsonPARAM'] +
						"' ",
				);
			}
		}
		return recSearchTemplateInstance(value);
	} else {
		if (Array.isArray(template)) {
			const result = [];
			for (let entry of template as any[]) {
				if (typeof entry !== 'number' && entry['jsonIF']) {
					if (instanceData[entry['jsonIF']] === undefined) {
						continue;
					}
					if (entry['jsonTHEN']) {
						entry = entry['jsonTHEN'];
					} else {
						entry = Helper.copy(entry);
						delete entry['jsonIF'];
					}
				}
				const sub = recResolveTemplateInstance(
					entry,
					instanceData,
					templates,
					tmpTemplates,
				);
				result.push(sub);
			}
			return result;
		}
		const result: any = {};
		for (const name of Object.keys(template)) {
			let entry = (template as any)[name] as Anims;
			if (entry['jsonIF']) {
				if (instanceData[entry['jsonIF']] === undefined) {
					continue;
				}
				if (entry['jsonTHEN']) {
					entry = entry['jsonTHEN'] as any;
				} else {
					entry = Helper.copy(entry);
					delete entry['jsonIF'];
				}
			}
			result[name] = recResolveTemplateInstance(
				entry,
				instanceData,
				templates,
				tmpTemplates,
			);
		}
		return result;
	}
}

export function flattenSUBs(obj: Anims, parent: Anims): Anims[] {
	const out: Anims[] = [];
	const merged = {
		...parent,
		...obj,
	};
	if (Array.isArray(obj.SUB)) {
		for (const sub of obj.SUB) {
			out.push(...flattenSUBs(sub, merged));
		}
	} else {
		out.push({
			...parent,
			...obj,
		});
	}
	return out;
}
