import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import {AbstractEvent, EventType} from '../../event-registry/abstract-event';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import {EventHelperService} from '../event-helper.service';

@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditorComponent implements OnInit, OnChanges {
	@Input() eventData: EventType[] = [];
	@Input() actionStep = false;
	
	workingData?: AbstractEvent<any>[];
	
	constructor(private helper: EventHelperService) {
		helper.selectedEvent.subscribe(v => {
			if (v) {
				// TODO: remove event?
				// console.log(v.text);
			}
		});
	}
	
	show() {
		console.log(this.workingData);
	}
	
	ngOnInit(): void {
	}
	
	ngOnChanges() {
		let cpy = JSON.parse(JSON.stringify(this.eventData));
		if (!cpy.map) {
			// TODO: find out how to properly handle quests
			cpy = cpy.quest;
		}
		if (cpy.map) {
			this.workingData = cpy.map((val: EventType) => this.helper.getEventFromType(val));
		} else {
			this.workingData = [];
		}
	}
	
	export() {
		if (this.workingData) {
			return this.workingData.map(event => event.export());
		} else {
			return this.eventData;
		}
	}
}
