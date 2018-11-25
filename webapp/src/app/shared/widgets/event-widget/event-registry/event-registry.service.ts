import {Injectable} from '@angular/core';
import {AddMsgPerson} from './add-msg-person';
import {DefaultEvent} from './default-event';
import {If} from './if';
import {ShowMsg} from './show-msg';
import {ShowChoice} from './ShowChoice';

@Injectable()
export class EventRegistryService {
	private events: { [type: string]: any } = {};
	private defaultEvent: any;
	
	constructor() {
		this.setDefaultEvent(DefaultEvent);
		this.register('ADD_MSG_PERSON', AddMsgPerson);
		this.register('SHOW_MSG', ShowMsg);
		this.register('SHOW_CHOICE', ShowChoice);
		this.register('IF', If);
	}
	
	private setDefaultEvent(event) {
		this.defaultEvent = event;
	}
	
	private register(type: string, event: any) {
		this.events[type] = event;
	}
	
	public getDefaultEvent(): any {
		return this.defaultEvent;
	}
	
	public getEvent(type: string): any {
		return this.events[type] || this.defaultEvent;
	}
	
	public getAll() {
		return this.events;
	}
	
	private hasEvent(type: string): boolean {
		return this.events.hasOwnProperty(type);
	}
}
