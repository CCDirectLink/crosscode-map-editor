import {CCEntity} from './cc-entity';

export class DefaultEntity extends CCEntity {
	private settings;
	
	getAttributes() {
		const out = {};
		Object.keys(this.settings).forEach(key => {
			out[key] = {
				type: 'Unknown'
			};
		});
		return out;
	}
	
	getScaleSettings() {
		return null;
	}
	
	protected setupType(settings: any) {
		this.settings = settings;
		this.generateNoImageType();
	}
}
