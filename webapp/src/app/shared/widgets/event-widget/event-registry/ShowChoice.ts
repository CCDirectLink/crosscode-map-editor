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
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>' + this.data.person.expression)
		);
		
		this.data.options.forEach((option, index) => {
			this.children[index] = {
				title: this.getColoredString('Choice. ' + option.label.en_US, '#838383'),
				events: this.data[index],
				hideGreaterSign: true
			};
		});
	}
	
}
