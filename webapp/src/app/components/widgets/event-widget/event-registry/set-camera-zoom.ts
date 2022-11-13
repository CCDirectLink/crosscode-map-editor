import { AbstractEvent } from './abstract-event';

export class SetCameraZoom extends AbstractEvent<any> {
	private attributes = {
		zoom: {
			type: 'Number',
			description: 'Zoom Value. 1=default, 2=twice pixel size',
		},
		duration: {
			type: 'Number',
			description: 'Duration of zoom transition'
		},
		transition: {
			type: 'String',
			description: 'Transition type',
			options: {
				EASE_IN_OUT: 0,
				EASE_OUT: 0,
				EASE_IN: 0,
				EASE: 0,
				EASE_SOUND: 0,
				LINEAR: 0,
				JUMPY: 0,
				EASE_OUT_STRONG: 0,
				EASE_IN_STRONG: 0,
			}
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#eeee30'),
			this.getAllPropStrings()
		);
	}
	
	protected generateNewDataInternal() {
		return {
			zoom: 1,
			transition: 'EASE_IN_OUT'
		};
	}
}
