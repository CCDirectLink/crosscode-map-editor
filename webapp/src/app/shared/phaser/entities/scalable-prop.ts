import {CCEntity, InputEvents, ScaleSettings} from './cc-entity';
import {Point, Point3} from '../../interfaces/cross-code-map';
import {Helper} from '../helper';

export interface ScalablePropDef {
	baseSize: Point3;
	terrain: string;
	scalableX: boolean;
	scalableY: boolean;
	scalableStep: number;
	renderHeight?: number;
	renderMode: string;
	collType: string;
	gfx: string;
	gfxBaseX: number;
	gfxBaseY: number;
	patterns: {
		x: number;
		y: number;
		w: number;
		h: number;
		xCount: number;
		yCount: number;
	};
	timePadding: Point;
	effects: {
		sheet: string;
		show: string;
		hide: string;
	};
	pivot: Point;
	jsonINSTANCE?: string;
	srcX?: number;
	srcY?: number;
	width?: number;
}

export class ScalableProp extends CCEntity {
	
	private attributes = {
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
			sta: 'If true, block path map and update when destroyed'
		},
		hideCondition: {
			type: 'VarCondition',
			description: 'Condition for entity to become transparent',
			R: true
		}
	};
	private scaleSettings: ScaleSettings = {};
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return this.scaleSettings;
	}
	
	protected setupType(settings: any) {
		if (!settings.propConfig) {
			console.warn('scalable prop without prop config');
			return this.generateNoImageType();
		}
		Helper.getJson('data/scale-props/' + settings.propConfig.sheet, (sheet) => {
			let prop: ScalablePropDef = sheet.entries[settings.propConfig.name];
			if (!prop) {
				console.error('scale-prop not found: ' + settings.propConfig.name);
				return this.generateNoImageType();
			}
			
			this.entitySettings = <any>{};
			if (prop.jsonINSTANCE) {
				const jsonInstance = sheet.jsonTEMPLATES[prop.jsonINSTANCE];
				const p = jsonInstance.patterns;
				this.replaceJsonParams(jsonInstance, prop);
				prop = jsonInstance;
			}
			
			if (prop.gfx) {
				this.entitySettings.sheets = {
					fix: [{
						gfx: prop.gfx,
						x: prop.gfxBaseX + prop.patterns.x,
						y: prop.gfxBaseY + prop.patterns.y,
						w: prop.patterns.w,
						h: prop.patterns.h,
						renderHeight: prop.renderHeight
					}],
					renderMode: prop.renderMode,
					flipX: false,
				};
			}
			
			this.scaleSettings = {
				scalableX: prop.scalableX,
				scalableY: prop.scalableY,
				scalableStep: prop.scalableStep,
				baseSize: prop.baseSize
			};
			
			Object.assign(this.entitySettings, this.scaleSettings);
			this.entitySettings.collType = prop.collType;
			this.entitySettings.pivot = prop.pivot;
			this.updateSettings();
		});
	}
}
