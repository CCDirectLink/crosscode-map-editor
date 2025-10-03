import { AbstractEvent } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export class SetOverlay extends AbstractEvent<any> {
	private attributes: EntityAttributes = {
		color: {
			type: 'Color',
			description: 'Color of overlay',
		},
		alpha: {
			type: 'Number',
			description: 'Alpha of overlay, range [0,1]. 0 = transparent',
		},
		time: {
			type: 'Number',
			description: 'Transition time to new overlay color and alpha',
		},
		lighter: {
			type: 'Boolean',
			description: 'Apply color in lighter mode',
		},
		overMessage: {
			type: 'Boolean',
			description: 'If true: show overlay above messages',
		},
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getAllPropStrings(),
		);
	}

	protected generateNewDataInternal() {
		return {
			overMessage: true,
		};
	}
}
