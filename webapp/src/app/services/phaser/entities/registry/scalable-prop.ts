import { Point, Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import { Fix } from '../cc-entity';
import { BallKill, Effects, prepareScalableProp, ScalablePropSheet } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

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

export interface ScalablePropConfig {
	sheet?: string;
	name?: string;
	ends?: {
		[key in keyof EntryGfxEnds]: string;
	};
}

export interface ScalablePropAttributes {
	propConfig?: ScalablePropConfig;
	
	// TODO: not implemented, probably easier with Phaser.GameObjects.TileSprite
	patternOffset?: Point;
	timeOffset?: number;
	spawnCondition?: string;
	touchVar?: string;
	blockNavMap?: boolean;
	hideCondition?: string;
}

export class ScalableProp extends DefaultEntity {
	
	private _onlyEnds = false;
	
	set onlyEnds(val: boolean) {
		this._onlyEnds = val;
	}
	
	protected override async setupType(settings: ScalablePropAttributes) {
		const propConfig = settings.propConfig;
		if (!propConfig) {
			console.warn('scalable prop without prop config');
			this.resetScaleSettings();
			return this.generateErrorImage();
		}
		const sheet = await Helper.getJson('data/scale-props/' + propConfig.sheet) as ScalablePropSheet | undefined;
		
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
		
		const scaleSettings = this.getScaleSettings()!;
		
		scaleSettings.scalableX = prop.scalableX!;
		scaleSettings.scalableY = prop.scalableY!;
		scaleSettings.scalableStep = prop.scalableStep!;
		scaleSettings.baseSize = prop.baseSize!;
		
		const size = this.details.settings['size'] as Point;
		
		if (!scaleSettings.scalableX || size.x < scaleSettings.baseSize.x) {
			size.x = scaleSettings.baseSize.x;
		}
		if (!scaleSettings.scalableY || size.y < scaleSettings.baseSize.y) {
			size.y = scaleSettings.baseSize.y;
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
				alpha: this._onlyEnds ? 0 : 1,
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
					fix.offsetY = pattern.h - (pattern.zHeight ?? 0);
					fix.ignoreBoundingboxY = true;
					break;
				case 'south':
					scaleableFix.offsetY = pattern.h;
					fix.offsetY = scale.y;
					fix.ignoreBoundingboxY = true;
					break;
			}
		}
		
		Object.assign(this.entitySettings, scaleSettings);
		this.entitySettings.collType = prop.collType!;
		this.entitySettings.pivot = prop.pivot!;
		this.updateSettings();
	}
	
	private resetScaleSettings() {
		const scaleSettings = this.getScaleSettings()!;
		
		scaleSettings.scalableX = true;
		scaleSettings.scalableY = true;
		scaleSettings.scalableStep = 1;
		scaleSettings.baseSize = {x: 1, y: 1};
	}
}
