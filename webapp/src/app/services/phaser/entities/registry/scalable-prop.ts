import { Point, Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { CCEntity, EntityAttributes, Fix, ScaleSettings } from '../cc-entity';
import { BallKill, Effects, prepareScalableProp, ScalablePropSheet } from '../../sheet-parser';

export interface ScalablePropDef {
	baseSize?: Point3;
	renderHeight?: number;
	scalableX?: boolean;
	scalableY?: boolean;
	scalableStep?: number;
	collType?: string;
	gfx?: string;
	gfxBaseX?: number;
	gfxBaseY?: number;
	patterns?: Patterns;
	gfxEnds?: EntryGfxEnds;
	animFrames?: number[];
	animTime?: number;
	terrain?: string;
	wallY?: number;
	effects?: Effects;
	renderMode?: string;
	timePadding?: Point;
	pivot?: Point;
	jsonINSTANCE?: string;
	srcX?: number;
	srcY?: number;
	width?: number;
	skyBlock?: boolean;
	ballKill?: BallKill;
}

export interface Patterns {
	x: number;
	y: number;
	w: number;
	h: number;
	zHeight?: number;
	xCount?: number;
	renderMode?: string;
	flipX?: boolean;
	yCount?: number;
	renderHeight?: number;
	fullBack?: boolean;
	animFrames?: number[];
}

export interface EntryGfxEnds {
	west?: GfxEndsDir;
	east?: GfxEndsDir;
	north?: GfxEndsDir;
	south?: GfxEndsDir;
}

export interface GfxEndsDir {
	[key: string]: Patterns;
}

export interface PropConfig {
	sheet?: string;
	name?: string;
	ends?: {
		[key in keyof EntryGfxEnds]: string;
	};
}

export class ScalableProp extends CCEntity {
	
	private attributes: EntityAttributes = {
		propConfig: {
			type: 'ScalablePropConfig',
			description: 'Type of Scalable Prop'
		},
		patternOffset: {
			type: 'Vec2',
			description: 'Start offset of the repeating pattern in pixels'
		},
		timeOffset: {
			type: 'Number',
			description: 'Time offset of the animation'
		},
		spawnCondition: {
			type: 'VarCondition',
			description: 'Condition for prop to appear',
			bd: true
		},
		HL: {
			type: 'VarName',
			description: 'Variable to be changed when prop is touched',
			R: true
		},
		blockNavMap: {
			type: 'Boolean',
			description: 'If true, block path map and update when destroyed'
		},
		hideCondition: {
			type: 'VarCondition',
			description: 'Condition for entity to become transparent',
			R: true
		}
	};
	
	// don't allow scaleSettings ref to be changed, allows realtime update of size vec2 widget
	private readonly scaleSettings: ScaleSettings = {
		scalableX: false,
		scalableY: false,
		baseSize: {x: 16, y: 16},
		scalableStep: 1
	};
	
	public getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings | undefined {
		return this.scaleSettings;
	}
	
	protected async setupType(settings: any) {
		const propConfig = settings.propConfig as PropConfig | undefined;
		if (!propConfig) {
			console.warn('scalable prop without prop config');
			this.resetScaleSettings();
			return this.generateErrorImage();
		}
		const sheet = await Helper.getJsonPromise('data/scale-props/' + propConfig.sheet) as ScalablePropSheet | undefined;
		
		if (!sheet) {
			console.warn('sheet not found: ' + propConfig.sheet);
			this.resetScaleSettings();
			return this.generateErrorImage();
		}
		
		let prop: ScalablePropDef = sheet.entries[propConfig.name!];
		if (!prop) {
			console.error('scale-prop not found: ' + propConfig.name);
			this.resetScaleSettings();
			return this.generateErrorImage();
		}
		prop = prepareScalableProp(prop, sheet);
		
		this.entitySettings = <any>{};
		
		this.scaleSettings.scalableX = prop.scalableX!;
		this.scaleSettings.scalableY = prop.scalableY!;
		this.scaleSettings.scalableStep = prop.scalableStep!;
		this.scaleSettings.baseSize = prop.baseSize!;
		
		if (!this.scaleSettings.scalableX) {
			this.details.settings['size'].x = this.scaleSettings.baseSize.x;
		}
		if (!this.scaleSettings.scalableY) {
			this.details.settings['size'].y = this.scaleSettings.baseSize.y;
		}
		
		
		let scaleableFix: Fix | undefined;
		if (prop.gfx) {
			await Helper.loadTexture(prop.gfx, this.scene);
			scaleableFix = {
				gfx: prop.gfx,
				x: prop.gfxBaseX! + prop.patterns!.x,
				y: prop.gfxBaseY! + prop.patterns!.y,
				w: prop.patterns!.w,
				h: prop.patterns!.h,
				renderHeight: prop.renderHeight,
				scalable: true,
			};
			this.entitySettings.sheets = {
				fix: [scaleableFix],
				renderMode: prop.renderMode,
			};
		} else {
			console.error('scalable prop has no gfx');
			this.resetScaleSettings();
			return this.generateErrorImage();
		}
		
		const scale = {
			x: 0,
			y: 0,
			...this.details.settings['size']
		} as Point;
		
		for (const [d, key] of Object.entries(propConfig.ends ?? {})) {
			if (!key) {
				continue;
			}
			const dir = d as keyof EntryGfxEnds;
			const pattern = prop.gfxEnds?.[dir]?.[key];
			if (!pattern) {
				console.error(`pattern not found: "${dir}" -> "${key}"`);
				continue;
			}
			const fix: Fix = {
				gfx: prop.gfx,
				x: prop.gfxBaseX! + pattern.x,
				y: prop.gfxBaseY! + pattern.y,
				w: pattern.w,
				h: pattern.h,
				renderHeight: pattern.renderHeight,
				flipX: pattern.flipX,
				renderMode: pattern.renderMode,
			};
			this.entitySettings.sheets.fix.push(fix);
			switch (dir) {
				case 'west':
					scaleableFix.offsetX = pattern.w;
					fix.offsetX = pattern.w / 2;
					fix.ignoreBoundingboxX = true;
					break;
				case 'east':
					scaleableFix.offsetWidth = pattern.w;
					fix.offsetX = scale.x - pattern.w / 2;
					fix.ignoreBoundingboxX = true;
					break;
				case 'north':
					scaleableFix.offsetHeight = pattern.h;
					fix.ignoreBoundingboxY = true;
					break;
				case 'south':
					scaleableFix.offsetY = pattern.h;
					fix.offsetY = scale.y;
					fix.ignoreBoundingboxY = true;
					break;
			}
		}
		
		Object.assign(this.entitySettings, this.scaleSettings);
		this.entitySettings.collType = prop.collType!;
		this.entitySettings.pivot = prop.pivot!;
		this.updateSettings();
	}
	
	private resetScaleSettings() {
		this.scaleSettings.scalableX = true;
		this.scaleSettings.scalableY = true;
		this.scaleSettings.scalableStep = 1;
		this.scaleSettings.baseSize = {x: 1, y: 1};
	}
}
