import {AbstractEvent, EventType} from './abstract-event';
import {Person} from '../../../../models/events';

interface AddMsgPersonData extends EventType {
	person: Person;
	name: string;
	side: string;
	order: number;
	clearSide: boolean;
}

export class AddMsgPerson extends AbstractEvent<AddMsgPersonData> {
	private attributes = {
		person: {
			type: 'PersonExpression',
			description: 'Person + Expression to add'
		},
		name: {
			type: 'LangLabel',
			description: 'Name to display under portrait if any',
			I: true
		},
		side: {
			type: 'String',
			description: 'Side to display Person at.',
			options: {
				RIGHT: 1,
				LEFT: 2
			}
		},
		order: {
			type: 'Number',
			description: 'Determines the order in which people are displayed on one side. LOWER values are in FRONT'
		},
		clearSide: {
			type: 'Boolean',
			description: 'Clear the side before adding the person'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>' + this.data.person.expression),
			this.getPropString('side'),
			this.getPropString('order'),
			this.getPropString('clearSide')
		);
	}
	
	generateNewDataInternal() {
		return {
			person: {}
		};
	}
}
