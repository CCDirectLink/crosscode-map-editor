import { Label, Person } from '../../../../models/events';
import { AbstractEvent, EventType } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

interface ShowMsgData extends EventType {
	message: Label;
	autoContinue: boolean;
	person: Person;
}

export class ShowMsg extends AbstractEvent<ShowMsgData> {
	private attributes: EntityAttributes = {
		person: {
			type: 'PersonExpression',
			description: 'Talking person',
		},
		message: {
			type: 'LangLabel',
			description: 'Message to display',
			hs: true,
		},
		autoContinue: {
			type: 'Boolean',
			description: 'Automatically continue after message',
		},
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getColoredString(
				this.data.person.person +
					'>&#8203;' +
					this.data.person.expression,
				'#ffe188',
			),
			this.getProcessedText(this.data.message),
		);
	}

	protected generateNewDataInternal() {
		return {
			person: {},
			message: {},
		};
	}
}
