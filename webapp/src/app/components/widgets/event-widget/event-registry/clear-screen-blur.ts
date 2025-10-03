import { AbstractEvent } from './abstract-event';

export class ClearScreenBlur extends AbstractEvent<any> {
	private attributes = {};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(this.getTypeString('#db78ee'));
	}

	protected generateNewDataInternal() {
		return {};
	}
}
