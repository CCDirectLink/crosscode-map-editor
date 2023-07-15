import { Helper } from './helper';
import { Point, Point3 } from '../../models/cross-code-map';
import { Fix } from './entities/cc-entity';

export interface PropSheet {
	DOCTYPE: string;
	props: PropDef[];
	jsonTEMPLATES?: JsonTemplates;
}

export interface JsonTemplates {
	[key: string]: Anims | Anims[keyof Anims];
}

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

export interface Anims {
	name?: string;
	frames?: number[];
	time?: number;
	repeat?: boolean;
	sheet?: AnimSheet | string;
	renderMode?: string;
	shapeType?: string;
	framesAlpha?: number[];
	flipX?: boolean;
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
	namedSheets?: { [key: string]: AnimSheet };
	framesSpriteOffset?: number[];
	globalTiming?: boolean;
	
	// ???? string just to not throw compiler errors, I don't know the type
	jsonIF?: string;
	jsonTHEN?: unknown;
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
	fx: Fx;
}

export interface Fx {
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

export function prepareSheet(sheetDef: PropSheet): PropSheet {
	const sheet = Helper.copy(sheetDef);
	for (const prop of sheet.props) {
		prop.anims = prepareProp(prop, sheet);
	}
	return sheet;
}

export function prepareProp(propDef: PropDef, sheetDef: PropSheet): Anims {
	return recSearchTemplateInstance(Helper.copy(propDef.anims), sheetDef.jsonTEMPLATES, {});
}

function recSearchTemplateInstance(
	json: Anims | Anims[keyof Anims],
	templates?: JsonTemplates,
	tmpTemplates?: JsonTemplates
) {
	if (!json || typeof (json) != 'object') {
		return json;
	}
	if (isJsonInstance(json)) {
		return resolveTemplateInstance(json, templates!, tmpTemplates!);
	}
	if (json instanceof Array) {
		for (let i = 0; i < json.length; i++) {
			json[i] = recSearchTemplateInstance(json[i], templates, tmpTemplates);
		}
		return json;
	}
	for (const key of Object.keys(json)) {
		// @ts-ignore
		json[key] = recSearchTemplateInstance(json[key], templates, tmpTemplates);
		
	}
	
	return json;
}

function resolveTemplateInstance(
	instanceData: SubJsonInstance,
	templates: JsonTemplates,
	tmpTemplates: JsonTemplates
) {
	const templateName = instanceData.jsonINSTANCE;
	const template = tmpTemplates[templateName] || templates[templateName];
	if (!template) {
		console.error('Could not find template \'' + templateName + '\'');
		return;
	}
	return recResolveTemplateInstance(template, instanceData, templates, tmpTemplates);
}

function recResolveTemplateInstance(
	template: JsonTemplates[''],
	instanceData: any,
	templates: JsonTemplates,
	tmpTemplates: JsonTemplates
): any {
	if (!template || typeof (template) != 'object') {
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
				throw new Error('Could not find template parameters \'' + template['jsonPARAM'] + '\' ');
			}
		}
		return recSearchTemplateInstance(value);
	} else {
		if (Array.isArray(template)) {
			const result = [];
			for (let i = 0; i < template.length; ++i) {
				let entry = template[i];
				if (entry['jsonIF']) {
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
				const sub = recResolveTemplateInstance(entry, instanceData, templates, tmpTemplates);
				if (Array.isArray(sub) && template[i]['jsonList']) {
					result.push(...sub);
				} else {
					result.push(sub);
				}
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
					entry = entry['jsonTHEN'];
				} else {
					entry = Helper.copy(entry);
					delete entry['jsonIF'];
				}
			}
			result[name] = recResolveTemplateInstance(entry, instanceData, templates, tmpTemplates);
		}
		return result;
	}
}
