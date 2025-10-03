import { DefaultEvent } from './default-event';
import { EventType } from './abstract-event';
import { Label, Person } from '../../../../models/events';

interface ShowSideMsgData extends EventType {
	message: Label;
	person: Person;
}

export class ShowSideMsg extends DefaultEvent<ShowSideMsgData> {
	override update() {
		this.info = this.combineStrings(
			this.getTypeString('#fa5aff'),
			this.getColoredString(
				this.data.person?.person +
					'>&#8203;' +
					this.data.person?.expression,
				'#ffe188',
			),
			this.getProcessedText(this.data.message),
		);
	}

	protected override generateNewDataInternal() {
		return {
			person: {},
			message: {},
		};
	}
}
