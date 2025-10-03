import { AbstractEvent } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export class Wait extends AbstractEvent<any> {
	private attributes: EntityAttributes = {
		time: {
			type: 'Number',
			description: 'Time to wait',
		},
		ignoreSlowDown: {
			type: 'Boolean',
			description: 'Ignore slow down rate on wait',
		},
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getTypeString('#5feee8'),
			this.getAllPropStrings(),
		);
	}

	protected generateNewDataInternal() {
		return {};
	}
}
