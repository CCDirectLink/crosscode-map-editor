import { Point, Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { CCEntity, EntityAttributes, Fix, ScaleSettings } from '../cc-entity';

export interface PropSheet {
	DOCTYPE: string;
	props: PropDef[];
	jsonTEMPLATES?: JsonTemplates;
}

interface JsonTemplates {
	[key: string]: JsonTemplate[];
}

export interface JsonTemplate {
	name: string;
	tileOffset?: number;
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
	SUB?: Anims[] | SubJsonInstance;
	tileOffset?: number;
	wallY?: number;
	offset?: Partial<Point3>;
	shape?: string;
	framesGfxOffset?: number[];
	size?: Point3;
	pivot?: Point;
	gfxOffset?: Point;
	aboveZ?: number;
	offX?: number;
	namedSheets?: { [key: string]: AnimSheet };
	framesSpriteOffset?: number[];
	globalTiming?: boolean;
	
	// doesn't exist, don't know why it's used here
	DOCTYPE?: string;
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

export interface BallKill {
	fx: Fx;
}

export interface Fx {
	sheet: string;
	name: string;
}

export interface PropType {
	sheet: string;
	name: string;
}

export interface PropAttributes {
	propType: PropType;
	propAnim: string;
	condAnims: string;
	spawnCondition: string;
	touchVar: string;
	interact: string;
	showEffect: string;
	hideEffect: string;
	permaEffect: string;
	hideCondition: string;
}

export class Prop extends CCEntity {
	
	private attributes: EntityAttributes = {
		propType: {
			type: 'PropType',
			description: 'Type of prop'
		},
		propAnim: {
			type: 'EntityAnim',
			description: 'Animation of prop'
		},
		condAnims: {
			type: 'CondAnims',
			description: 'Animations shown by conditions'
		},
		spawnCondition: {
			type: 'VarCondition',
			description: 'Condition for prop to appear',
			bd: true
		},
		touchVar: {
			type: 'VarName',
			description: 'Variable to be changed when prop is touched',
			R: true
		},
		interact: {
			type: 'PropInteract',
			description: 'Interaction for this property',
			bd: true,
			R: true
		},
		showEffect: {
			type: 'Effect',
			description: 'Effect to show when showing entity',
			R: true
		},
		hideEffect: {
			type: 'Effect',
			description: 'Effect to show when hiding entity',
			R: true
		},
		permaEffect: {
			type: 'Effect',
			description: 'Effect to be shown permanently',
			R: true
		},
		hideCondition: {
			type: 'VarCondition',
			description: 'Condition for entity to become transparent',
			R: true
		}
	};
	
	public getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected async setupType(settings: PropAttributes) {
		if (!settings.propType) {
			console.warn('prop without prop type');
			return this.generateErrorImage();
		}
		const sheet = await Helper.getJsonPromise('data/props/' + settings.propType.sheet) as PropSheet;
		if (!sheet) {
			console.warn('prop without sheet', settings);
			return this.generateErrorImage();
		}
		
		let prop: PropDef | undefined;
		for (let i = 0; i < sheet.props.length; i++) {
			const p = sheet.props[i];
			if (settings.propType.name === p.name) {
				prop = p;
				break;
			}
		}
		if (!prop) {
			console.error('prop not found: ' + settings.propType.name);
			return this.generateErrorImage();
		}
		
		this.entitySettings = {sheets: {fix: []}} as any;
		if (prop.anims) {
			await this.setupAnims(settings, prop, sheet);
		} else if (prop.fix) {
			const exists = await Helper.loadTexture(prop.fix.gfx, this.scene);
			if (!exists) {
				console.error('prop image does not exist: ' + prop.fix.gfx);
				return this.generateErrorImage();
			}
			
			this.entitySettings.sheets.fix[0] = prop.fix;
			this.entitySettings.sheets.renderMode = prop.fix.renderMode;
		} else {
			console.error('failed to create prop: ' + prop.name);
			return this.generateErrorImage();
		}
		this.entitySettings.baseSize = prop.size;
		this.entitySettings.collType = prop.collType;
		this.updateSettings();
	}
	
	private async setupAnims(settings: PropAttributes, propDef: PropDef, sheetDef: PropSheet) {
		
		// console.log('------');
		// console.log(settings);
		// console.log('prop: ', propDef);
		// console.log('sheet: ', sheetDef);
		
		const anims = propDef.anims!;
		if (anims.DOCTYPE) {
			console.error('prop anim has DOCTYPE :/ ', propDef.name);
			return this.generateErrorImage();
		}
		
		const sprites: {
			sheet: AnimSheet;
			tileOffset: number;
			alpha: number;
			offset?: Point3;
			renderMode?: string;
		}[] = [];
		
		
		if (anims.sheet || anims.namedSheets) {
			this.setupAnim(settings, anims, sheetDef, propDef.name!, sprites);
		} else {
			if (anims.SUB) {
				for (const anim of anims.SUB as Anims[]) {
					this.setupAnim(settings, anim, sheetDef, propDef.name!, sprites);
				}
			}
		}
		
		
		if (sprites.length === 0) {
			console.warn('failed creating prop: ', settings);
			
			return this.generateErrorImage();
		}
		
		
		this.entitySettings.sheets.fix = [];
		for (const sprite of sprites) {
			
			if (!sprite.sheet) {
				console.error('prop sheet not found, ', propDef.name);
				return this.generateErrorImage();
			}
			
			await Helper.loadTexture(sprite.sheet.src, this.scene);
			
			const fix = {
				gfx: sprite.sheet.src,
				w: sprite.sheet.width,
				h: sprite.sheet.height,
				x: sprite.sheet.width * sprite.tileOffset + (sprite.sheet.offX || 0),
				y: sprite.sheet.offY || 0,
				alpha: sprite.alpha,
				offsetX: 0,
				offsetY: 0,
				renderMode: sprite.renderMode
			};
			
			if (sprite.offset) {
				fix.offsetX = sprite.offset.x || 0;
				fix.offsetY = (sprite.offset.y || 0) - (sprite.offset.z || 0);
			}
			this.entitySettings.sheets.fix.push(fix);
		}
	}
	
	private setupAnim(settings: PropAttributes, anims: Anims, sheetDef: PropSheet, pname: string, sprites: {
		sheet: AnimSheet;
		tileOffset: number;
		alpha: number;
		offset?: Partial<Point3>;
		renderMode?: string;
	}[]) {
		let subArr = anims.SUB as Anims[];
		if (anims.namedSheets) {
			let template: JsonTemplate | undefined;
			const sub = subArr[0].SUB as SubJsonInstance | undefined;
			if (sub && sub.jsonINSTANCE) {
				
				const templates = sheetDef.jsonTEMPLATES?.[sub.jsonINSTANCE];
				template = templates?.find(t => t.name === settings.propAnim);
				
				if (!template) {
					console.error(`prop json template with name ${settings.propAnim} not found, `, pname);
					return this.generateErrorImage();
				}
				const name = anims.sheet as string || subArr[0].sheet as string;
				sprites.push({
					sheet: anims.namedSheets[name],
					alpha: 1,
					offset: subArr[0].offset,
					tileOffset: template.tileOffset || 0
				});
			} else {
				
				// sometimes anims.SUB is already an array of templates
				if (subArr.length > 0 && (subArr[0] as any).name) {
					const templates = anims.SUB;
					subArr = [{
						SUB: templates,
						renderMode: anims.renderMode
					}];
				}
				
				for (const sub of subArr) {
					const templates = sub.SUB;
					if (!templates || !Array.isArray(templates)) {
						continue;
					}
					
					const filteredTemplates = templates.filter(t => t.name === settings.propAnim);
					
					for (const template of filteredTemplates) {
						const name = (anims.sheet || subArr[0].sheet || template.sheet) as string;
						
						const alpha = sub.framesAlpha || template.framesAlpha || [];
						const sprite = {
							sheet: anims.namedSheets[name],
							renderMode: sub.renderMode || template.renderMode,
							offset: sub.offset || template.offset,
							alpha: alpha[0] || 1,
							tileOffset: template.tileOffset || 0
						};
						
						sprites.push(sprite);
					}
				}
			}
		} else if (anims.sheet) {
			sprites.push({
				sheet: anims.sheet as AnimSheet,
				alpha: 1,
				tileOffset: 0,
				renderMode: anims.renderMode
			});
		} else {
			console.error('prop anim has no sheet: ', pname);
			return this.generateErrorImage();
		}
	}
}
