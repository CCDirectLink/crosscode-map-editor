import {CCEntity, ScaleSettings} from '../cc-entity';

export class EventTrigger extends CCEntity {
	
	private attributes = {
		eventType: {
			type: 'String',
			description: 'Type of event. Cutscenes will stop the movement of the player and can\'t be executed in parallel. Auto Control events will take over the player\'s control.',
			options: {
				PARALLEL: 1,
				CUTSCENE: 2,
				INTERRUPTABLE: 3,
				AUTO_CONTROL: 4,
				COMBAT_CUTSCENE: 5
			}
		},
		startCondition: {
			type: 'VarCondition',
			description: 'Condition for the event to start',
			bd: true
		},
		endCondition: {
			type: 'VarCondition',
			description: 'Condition for the event to not start (even if start condition is true)',
			bd: true,
			default: 'false'
		},
		event: {
			type: 'Event',
			description: 'Event to be performed',
			bd: true
		},
		triggerType: {
			type: 'String',
			description: 'How often should this event be run?',
			options: {
				ALWAYS: 0,
				ONCE_PER_ENTRY: 1,
				ONCE: 2
			}
		},
		loadCondition: {
			type: 'EventLoadCondition',
			description: 'If true: condition is checked on map entry and event is only loaded if true. onStart => Use start conditions, custom => use custom conditions',
			I: true
		}
	};
	
	public getAttributes() {
		return this.attributes;
	}
	
	getScaleSettings(): ScaleSettings {
		return undefined;
	}
	
	protected setupType(settings: any) {
		this.generateNoImageType(0, 50, 255, 0.7);
	}
}
