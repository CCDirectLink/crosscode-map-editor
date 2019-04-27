import {AbstractEvent, EventType} from './abstract-event';
import {Label, Person} from '../../../../models/events';
import {Globals} from '../../../globals';
interface ShowMsgData extends EventType {
	message: Label;
	autoContinue: boolean;
	person: Person;
}

export class ShowMsg extends AbstractEvent<ShowMsgData> {
	private attributes = {
		person: {
			type: 'PersonExpression',
			description: 'Talking person'
		},
		message: {
			type: 'LangLabel',
			description: 'Message to display',
			hs: true
		},
		autoContinue: {
			type: 'Boolean',
			description: 'Automatically continue after message'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getColoredString(this.data.person.person + '>' + this.data.person.expression, '#ffe188'),
			this.data.message[Globals.lang]
		);
	}
	
	protected generateNewDataInternal() {
		return {
			person: {},
			message: {}
		};
	}
	
}
