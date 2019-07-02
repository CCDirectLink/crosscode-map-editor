import {AbstractEvent} from './abstract-event';
import {EntityAttributes} from '../../../phaser/entities/cc-entity';

export class DefaultEvent extends AbstractEvent<any> {
	getAttributes(): EntityAttributes {
		return {};
	}
	
	update() {
		this.info = this.getTypeString('#ff5a5b') + ' ' + this.getAllPropStrings();
	}
	
	protected generateNewDataInternal() {
		return {};
	}
	
}
