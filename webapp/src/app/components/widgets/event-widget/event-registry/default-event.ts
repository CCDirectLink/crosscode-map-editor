import { DomSanitizer } from '@angular/platform-browser';
import actions from '../../../../../assets/actions.json';
import events from '../../../../../assets/events.json';
import { AttributeValue, EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';

interface DefaultEventData extends EventType {
	[key: string]: any;
}

interface JsonEventType {
	attributes: {
		[key: string]: { noLabel: boolean } & AttributeValue;
	};
}

export class DefaultEvent<T extends EventType = DefaultEventData> extends AbstractEvent<T> {
	private readonly type?: JsonEventType;
	
	constructor(
		domSanitizer: DomSanitizer,
		data: T,
		actionStep = false
	) {
		super(domSanitizer, data, actionStep);
		if (actionStep) {
			this.type = actions[this.data.type];
		} else {
			this.type = events[this.data.type];
		}
	}
	
	getAttributes(): EntityAttributes | undefined {
		if (this.type) {
			return this.type.attributes;
		}
		return undefined;
	}
	
	update() {
		this.info = this.getTypeString('#ff5a5b');
		if (!this.type) {
			this.info += ' ' + this.getAllPropStrings();
			return;
		}
		
		for (const key of Object.keys(this.type.attributes)) {
			if (this.type.attributes[key].noLabel) {
				continue;
			}
			if (this.data[key as keyof T] !== undefined) {
				this.info += ' ' + this.getPropString(key);
			}
		}
	}
	
	protected generateNewDataInternal() {
		return {};
	}
	
}
