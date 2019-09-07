import {AbstractEvent, EventType} from './abstract-event';
import {AttributeValue, EntityAttributes} from '../../../phaser/entities/cc-entity';
import events from '../../../../../assets/events.json';

interface DefaultEventData extends EventType {
	[key: string]: any;
}

interface JsonEventType {
	attributes: {
		[key: string]: { noLabel: boolean } & AttributeValue;
	};
}

export class DefaultEvent extends AbstractEvent<DefaultEventData> {
	private readonly type?: JsonEventType;
	
	constructor(data: DefaultEventData) {
		super(data);
		this.type = events[this.data.type];
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
			if (this.data[key] !== undefined) {
				this.info += ' ' + this.getPropString(key);
			}
		}
	}
	
	protected generateNewDataInternal() {
		return {};
	}
	
}
