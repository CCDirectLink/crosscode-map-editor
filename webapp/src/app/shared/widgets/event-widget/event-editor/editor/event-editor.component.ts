import {Component, OnChanges, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {EventRegistryService} from '../../event-registry/event-registry.service';

@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
})
export class EventEditorComponent implements OnInit {
	@Input() eventData = [];
	
	workingData: AbstractEvent<any>[];
	
	constructor(private eventRegistry: EventRegistryService) {
	}
	
	ngOnInit(): void {
		this.initialize();
	}
	
	initialize() {
		this.workingData = this.eventData.map(val => this.getEventFromType(val));
	}
	
	private getEventFromType(val) {
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
		
		instance.updateInfo();
		
		return instance;
	}
}
