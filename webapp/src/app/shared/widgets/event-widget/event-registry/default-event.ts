import {AbstractEvent} from './abstract-event';

export class DefaultEvent extends AbstractEvent<any> {
	getAttributes() {
		return null;
	}
	
	update() {
		this.info = this.getTypeString('#ff5a5b') + ' ' + this.getAllPropStrings();
	}
	
	protected generateNewDataInternal() {
		return {};
	}
	
}
