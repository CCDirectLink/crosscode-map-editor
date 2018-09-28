import {CCEntity, InputEvents, ScaleSettings} from './cc-entity';
import {Helper} from '../helper';
import {Fix, ScalableProp} from '../../interfaces/props';

export interface PropDef {
	name: string;
	size: {
		x: number;
		y: number;
		z: number
	};
	collType: string;
	fix: Fix;
}

export class Prop extends CCEntity {
	
	private attributes = {
		propType: {
			type: 'PropType',
			description: 'Type of prop'
		},
		propAnim: {
			type: 'EntityAnim',
			description: 'Animation of prop'
		},
		AG: {
			type: 'CondAnims',
			description: 'Animations shown by conditions'
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
		interact: {
			type: 'PropInteract',
			description: 'Interaction for this property',
			bd: true,
			R: true
		},
		jGa: {
			type: 'Effect',
			description: 'Effect to show when showing entity',
			R: true
		},
		Zrb: {
			type: 'Effect',
			description: 'Effect to show when hiding entity',
			R: true
		},
		MB: {
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
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return undefined;
	}
	
	protected setupType(settings: any) {
		if (!settings.propType) {
			console.warn('prop without prop type');
			return;
		}
		Helper.getJson('data/props/' + settings.propType.sheet, (sheet) => {
			let prop: PropDef;
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
			this.anchor.y = 1;
			this.anchor.x = 0.5;
			
			this.entitySettings = <any>{sheets: {fix: []}};
			if (prop.fix) {
				this.entitySettings.sheets.fix[0] = prop.fix;
				this.entitySettings.sheets.renderMode = prop.fix.renderMode;
			} else {
				console.log('sheet not found for prop: ' + prop.name);
				console.log(this.group.x);
				console.log(this.group.y);
				return this.generateNoImageType(0, 255, 60);
			}
			this.entitySettings.baseSize = prop.size;
			this.entitySettings.collType = prop.collType;
			this.updateSettings();
		});
		
	}
}
