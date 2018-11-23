import {AbstractEvent, EventType} from './abstract-event';
import {Label, Person} from '../../../../models/events';

interface ShowMsgData extends EventType {
	message: Label;
	autoContinue: boolean;
	person: Person;
}

export class ShowMsg extends AbstractEvent<ShowMsgData> {
	getAttributes() {
		return {};
	}
	
	updateInfo() {
		this.infos[0] = this.combineStrings(
			this.getColoredString(this.data.person.person + '>' + this.data.person.expression, '#ffe188'),
			this.data.message.en_US
		);
	}
	
}
