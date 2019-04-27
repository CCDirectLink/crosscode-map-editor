import {AbstractEvent, EventType} from './abstract-event';
import {Label, Person} from '../../../../models/events';
import {Globals} from '../../../globals';
interface ShowChoiceData extends EventType {
	0?: AbstractEvent<any>[];
	1?: AbstractEvent<any>[];
	2?: AbstractEvent<any>[];
	3?: AbstractEvent<any>[];
	person: Person;
	options: {
		label: Label;
		activeCondition: any;
	}[];
	columns: number;
	forceWidth: number;
}

export class ShowChoice extends AbstractEvent<ShowChoiceData> {
	private attributes = {
		person: {
			type: 'PersonExpression',
			description: 'Talking person'
		},
		options: {
			type: 'ChoiceOptions',
			description: 'List of options',
			C2: true
		},
		columns: {
			type: 'Integer',
			description: 'Number of buttons columns.',
			I: true,
			min: 2
		},
		forceWidth: {
			type: 'Integer',
			description: 'Override the default button width. NOTE: Buttons still get matched when a text is to large.',
			I: true
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.children = [];
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>' + this.data.person.expression)
		);
		
		this.data.options.forEach((option, index) => {
			this.children[index] = {
				title: this.getColoredString('Choice. ' + option.label[Globals.lang], '#838383'),
				events: this.data[index] || [],
				hideGreaterSign: true
			};
		});
	}
	
	
	export(): ShowChoiceData {
		const out: ShowChoiceData = {
			type: this.data.type,
			person: this.data.person,
			options: this.data.options,
			columns: this.data.columns,
			forceWidth: this.data.forceWidth
		};
		this.children.forEach((child, index) => {
			if (!child.events) {
				console.error('wtf', this);
			}
			out[index] = child.events.map(v => v.export());
		});
		
		return JSON.parse(JSON.stringify(out));
	}
	
	protected generateNewDataInternal() {
		return {
			person: {},
			options: [{
				label: {}
			}, {
				label: {}
			}]
		};
	}
}
