import { Person } from '../../../../models/events';
import { EventType } from './abstract-event';
import { DefaultEvent } from './default-event';

interface SetMsgExpressionData extends EventType {
	person: Person;
}

export class SetMsgExpression extends DefaultEvent<SetMsgExpressionData> {
    private attributes = {
        person: {
            type: 'PersonExpression',
            description: 'Person + Expression to change'
        }
    };

    override update() {
        this.info = this.combineStrings(
            this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>&#8203;' + this.data.person.expression),
        );
    }

    override generateNewDataInternal() {
		return {
			person: {}
		};
	}
}
