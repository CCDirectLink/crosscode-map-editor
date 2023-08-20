import { Helper } from '../../../../services/phaser/helper';
import { Label, Person } from '../../../../models/events';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';
import { DefaultEvent } from './default-event';

export interface ShowChoiceData extends EventType {
	[key: number]: AbstractEvent<any>[];
	
	person: Person;
	options: {
		label: Label;
		activeCondition: any;
	}[];
	columns: number;
	forceWidth: number;
}

export class ShowChoice extends DefaultEvent<ShowChoiceData> {
	private attributes: EntityAttributes = {
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
	
	override update() {
		this.children = [];
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>&#8203;' + this.data.person.expression)
		);
		
		this.data.options.forEach((option, index) => {
			this.children[index] = {
				title: this.getColoredString('Choice: ', '#838383') + this.getProcessedText(option.label),
				events: this.data[index] || [],
				draggable: false
			};
		});
	}
	
	
	override export(): ShowChoiceData {
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
		
		return Helper.copy(out);
	}
	
	protected override generateNewDataInternal() {
		return {
			person: {},
			options: [{
				label: {
					en_US: 'Choice 1'
				}
			}, {
				label: {
					en_US: 'Choice 2'
				}
			}]
		};
	}
}
