import {AbstractEvent} from './abstract-event';

export class DefaultEvent extends AbstractEvent<any> {
	getAttributes() {
		return null;
	}
	
	updateInfo() {
		this.infos[0] = this.getTypeString('#ff5a5b') + ' ---';
	}
	
}
