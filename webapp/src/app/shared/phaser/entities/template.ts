import {CCEntity, ScaleSettings} from './cc-entity';

export class Template extends CCEntity {
	
	private attributes = {};
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return undefined;
	}
	
	protected setupType(settings: any) {
	
	}
}
