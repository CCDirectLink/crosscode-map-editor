import {AbstractEvent, EventType} from './abstract-event';
import {Label, Person} from '../../../../models/events';

interface ShowChoiceData extends EventType {
	0: AbstractEvent<any>[];
	1?: AbstractEvent<any>[];
	2?: AbstractEvent<any>[];
	3?: AbstractEvent<any>[];
	person: Person;
	options: {
		label: Label;
		activeCondition: any;
	}[];
}

export class ShowChoice extends AbstractEvent<ShowChoiceData> {
	getAttributes() {
		return {};
	}
	
	updateInfo() {
		this.data.options.forEach((option, index) => {
			this.infos[index + 1] = this.getColoredString('Choice. ' + option.label.en_US, '#838383');
			this.children[index + 1] = this.data[index];
			this.hideGreaterSign[index + 1] = true;
		});
		console.log(this.children);
		
		this.infos[0] = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>' + this.data.person.expression)
		);
	}
	
}
