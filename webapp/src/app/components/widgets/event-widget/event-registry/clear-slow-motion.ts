import { AbstractEvent } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export class ClearSlowMotion extends AbstractEvent<any> {
	private attributes: EntityAttributes = {
		name: {
			type: 'String',
			description: 'Name of slow motion to be removed'
		},
		time: {
			type: 'Number',
			description: 'Transition time for slow motion removal'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#db78ee'),
			this.getPropString('name'),
			this.getPropString('time')
		);
	}
	
	protected generateNewDataInternal() {
		return {
			time: 0
		};
	}
}
