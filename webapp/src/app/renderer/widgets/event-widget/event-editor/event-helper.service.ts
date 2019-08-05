import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {WidgetModule} from '../../widget.module';
import {AbstractEvent, EventType} from '../event-registry/abstract-event';
import {EventRegistryService} from '../event-registry/event-registry.service';
import {AttributeValue} from '../../../phaser/entities/cc-entity';
import {If, IfData} from '../event-registry/if';
import {ShowChoice, ShowChoiceData} from '../event-registry/ShowChoice';

@Injectable()
export class EventHelperService {
	
	selectedEvent: BehaviorSubject<any> = new BehaviorSubject(null);
	
	constructor(private eventRegistry: EventRegistryService) {
	}
	
	public getEventFromType(val: EventType): AbstractEvent<any> {
		const eventClass = this.eventRegistry.getEvent(val.type);
		const instance: AbstractEvent<any> = new eventClass(val);
		
		if (val.type === 'IF') {
			const valIf = val as any;
			valIf.thenStep = valIf.thenStep.map((v: EventType) => this.getEventFromType(v));
			if (valIf.elseStep) {
				valIf.elseStep = valIf.elseStep.map((v: EventType) => this.getEventFromType(v));
			}
		} else if (val.type === 'SHOW_CHOICE') {
			const valChoice = val as any;
			valChoice.options.forEach((option: any, index: number) => {
				valChoice[index] = valChoice[index].map((v: EventType) => this.getEventFromType(v));
			});
		}
		
		instance.update();
		
		return instance;
	}
}
