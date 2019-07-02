import {EntityAttributes, CCEntity, ScaleSettings} from '../cc-entity';

export class DefaultEntity extends CCEntity {
	private settings: any;
	
	getAttributes(): EntityAttributes {
		const out: EntityAttributes = {};
		Object.keys(this.settings).forEach(key => {
			out[key as keyof EntityAttributes] = {
				type: 'Unknown',
				description: ''
			};
		});
		return out;
	}
	
	getScaleSettings(): ScaleSettings | undefined {
		return undefined;
	}
	
	protected setupType(settings: any) {
		this.settings = settings;
		this.generateNoImageType();
	}
}
