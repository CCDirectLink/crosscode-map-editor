import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {WidgetModule} from '../../widget.module';
import {AbstractEvent} from '../event-registry/abstract-event';
import {EventRegistryService} from '../event-registry/event-registry.service';

@Injectable()
export class EventHelperService {
	
	selectedEvent: BehaviorSubject<any> = new BehaviorSubject(null);
	
	constructor(private eventRegistry: EventRegistryService) {
	}
	
	public getEventFromType(val) {
		const eventClass = this.eventRegistry.getEvent(val.type);
		const instance: AbstractEvent<any> = new eventClass(val);
		
		if (val.type === 'IF') {
			val.thenStep = val.thenStep.map(v => this.getEventFromType(v));
			if (val.elseStep) {
				val.elseStep = val.elseStep.map(v => this.getEventFromType(v));
			}
		} else if (val.type === 'SHOW_CHOICE') {
			val.options.forEach((option, index) => {
				val[index] = val[index].map(v => this.getEventFromType(v));
			});
		}
		
		instance.update();
		
		return instance;
	}
}
