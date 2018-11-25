import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import {EventHelperService} from '../event-helper.service';

@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventEditorComponent implements OnInit, OnChanges {
	@Input() eventData = [];
	
	workingData: AbstractEvent<any>[];
	focusedElement;
	
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
	
	setFocusedElement(element) {
		this.focusedElement = element;
	}
	
	ngOnChanges() {
		const cpy = JSON.parse(JSON.stringify(this.eventData));
		this.workingData = cpy.map(val => this.helper.getEventFromType(val));
	}
	
	export() {
		return this.workingData.map(event => event.export());
	}
}
