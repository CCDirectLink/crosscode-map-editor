import {EntityAttributes, CCEntity, InputEvents, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';
import {Fix} from '../../../../models/props';

export interface PropDef {
	name: string;
	size: {
		x: number;
		y: number;
		z: number
	};
	collType: string;
	fix?: Fix;
	anims?: {
		SUB: any[];
		frames: any[];
		framesGfxOffset: any[];
		namedSheets: any;
		repeat: boolean;
		shape: string;
		sheet: string;
		time: number;
	};
	effects?: {
		hide: string;
		sheet: string;
		show: string;
	};
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
	
	protected setupType(settings: any) {
		if (!settings.propType) {
			console.warn('prop without prop type');
			return this.generateNoImageType();
		}
		Helper.getJson('data/props/' + settings.propType.sheet, (sheet) => {
			let prop: PropDef | undefined;
			if (!sheet) {
				console.warn('prop without sheet', settings);
				return this.generateNoImageType();
			}
			for (let i = 0; i < sheet.props.length; i++) {
				const p = sheet.props[i];
				if (settings.propType.name === p.name) {
					prop = p;
					break;
				}
			}
			if (!prop) {
				console.error('prop not found: ' + settings.propType.name);
				return this.generateNoImageType();
			}

			this.entitySettings = <any>{sheets: {fix: []}};
			if (prop.fix) {
				this.entitySettings.sheets.fix[0] = prop.fix;
				this.entitySettings.sheets.renderMode = prop.fix.renderMode;
			} else {
				console.log('sheet not found for prop: ' + prop.name);
				return this.generateNoImageType(0, 255, 60);
			}
			this.entitySettings.baseSize = prop.size;
			this.entitySettings.collType = prop.collType;
			this.updateSettings();
		});

	}
}
