import { AbstractEvent } from './abstract-event';

export class SetCameraPos extends AbstractEvent<any> {
	private attributes = {
		pos: {
			type: 'Vec2',
			description: 'Position to focus camera on',
		},
		speed: {
			type: 'String',
			description: 'Speed of camera movement',
			options: {
				NORMAL: 0.1,
				FAST: 0.05,
				FASTER: 0.0375,
				FASTEST: 0.025,
				FASTESTEST: 0.0175,
				SLOW: 0.15,
				SLOWER: 0.2,
				SLOWEST: 0.3,
				SLOWESTEST: 0.5,
				SLOWEST_DREAM: 1,
				IMMEDIATELY: 1E-6
			}
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
		},
		wait: {
			type: 'Boolean',
			description: 'Wait until camera movement is done'
		},
		waitSkip: {
			type: 'Number',
			description: 'The amount of seconds to skip waiting before target is reached.'
		},
		zoom: {
			type: 'Number',
			description: 'Zoom Value. 1=default, 2=twice pixel size',
			ab: 1
		},
		name: {
			type: 'String',
			description: 'If set, camera target will remain even after event is done and can only be removed explictly via its name.',
			I: true
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
			pos: {x: 0, y: 0},
			speed: 'NORMAL',
			transition: 'EASE_IN_OUT',
		};
	}
}
