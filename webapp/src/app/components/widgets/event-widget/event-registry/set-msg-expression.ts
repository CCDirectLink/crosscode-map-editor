import { Person } from '../../../../models/events';
import { AbstractEvent, EventType } from './abstract-event';

interface SetMsgExpressionData extends EventType {
	person: Person;
}

export class SetMsgExpression extends AbstractEvent<SetMsgExpressionData> {
    private attributes = {
        person: {
            type: 'PersonExpression',
            description: 'Person + Expression to change'
        }
    };

    getAttributes() {
        return this.attributes;
    }

    update() {
        this.info = this.combineStrings(
            this.getTypeString('#7ea3ff'),
			this.getPropString('person', this.data.person.person + '>&#8203;' + this.data.person.expression),
        );
    }

    generateNewDataInternal() {
		return {
			person: {}
		};
	}
}
