import { DomSanitizer } from '@angular/platform-browser';
import {
	AttributeValue,
	EntityAttributes,
} from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';
import { Globals } from '../../../../services/globals';

export type ActionsJson = Record<string, JsonEventType>;

export type EventsJson = Record<string, JsonEventType>;

interface DefaultEventData extends EventType {
	[key: string]: any;
}

interface JsonEventType {
	attributes: Record<string, { noLabel: boolean } & AttributeValue>;
}

export class DefaultEvent<
	T extends EventType = DefaultEventData,
> extends AbstractEvent<T> {
	private readonly type?: JsonEventType;

	constructor(domSanitizer: DomSanitizer, data: T, actionStep = false) {
		super(domSanitizer, data, actionStep);
		const jsonLoader = Globals.jsonLoader;
		if (actionStep) {
			this.type =
				jsonLoader.loadJsonMergedSync<ActionsJson>('actions.json')[
					this.data.type
				];
		} else {
			this.type =
				jsonLoader.loadJsonMergedSync<EventsJson>('events.json')[
					this.data.type
				];
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
