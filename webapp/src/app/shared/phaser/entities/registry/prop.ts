import {CCEntity, EntityAttributes, ScaleSettings} from '../cc-entity';
import {Helper} from '../../helper';
import {Fix} from '../../../../models/props';

interface PropSheet {
	DOCTYPE: string;
	props: PropDef[];
}

interface Anims {
	DOCTYPE?: string;
	SUB: any[];
	frames: any[];
	framesGfxOffset: any[];
	namedSheets: {
		[key: string]: any
	};
	repeat: boolean;
	shape: string;
	sheet: string;
	time: number;
}

interface PropAttributes {
	propType: {
		sheet: string;
		name: string;
	};
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

export interface PropDef {
	name: string;
	size: {
		x: number;
		y: number;
		z: number
	};
	collType: string;
	fix?: Fix;
	anims?: Anims;
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
			this.setupAnims(settings, prop);
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
	
	private setupAnims(settings: PropAttributes, prop: PropDef) {
		// TODO
	}
}
