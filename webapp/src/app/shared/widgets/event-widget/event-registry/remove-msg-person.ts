import {AbstractEvent, EventType} from './abstract-event';
import {Person} from '../../../../models/events';

interface RemoveMsgPersonData extends EventType {
	person: Person;
}

export class RemoveMsgPerson extends AbstractEvent<RemoveMsgPersonData> {
	private attributes = {
		person: {
			type: 'Character',
			description: 'Person to remove'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person)
		);
	}
	
	generateNewDataInternal() {
		return {
			person: ""
		};
	}
}
