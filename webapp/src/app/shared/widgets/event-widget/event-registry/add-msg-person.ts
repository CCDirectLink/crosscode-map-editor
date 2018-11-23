import {AbstractEvent, EventType} from './abstract-event';
import {Person} from '../../../../models/events';

interface AddMsgPersonData extends EventType {
	side: string;
	order: number;
	clearSide: boolean;
	person: Person;
}

export class AddMsgPerson extends AbstractEvent<AddMsgPersonData> {
	getAttributes() {
		return {};
	}
	
	updateInfo() {
		this.infos[0] = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person) + '>' + this.data.person.expression,
			this.getPropString('side'),
			this.getPropString('order'),
			this.getPropString('clearSide')
		);
	}
	
}
