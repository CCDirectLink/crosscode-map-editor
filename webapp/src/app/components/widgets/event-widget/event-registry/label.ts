import { AbstractEvent, EventType } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export interface LabelData extends EventType {
	name: string;
}

export class Label extends AbstractEvent<LabelData> {
	private attributes: EntityAttributes = {
		name: {
			type: 'String',
			description: 'Name to reference this label by.',
		},
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getTypeString('#4254f5'),
			this.getPropString('name'),
		);
	}

	generateNewDataInternal() {
		return {
			name: 'NEW LABEL',
		};
	}
}
