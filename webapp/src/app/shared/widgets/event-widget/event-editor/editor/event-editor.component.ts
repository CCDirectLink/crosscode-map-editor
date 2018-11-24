import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy
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
export class EventEditorComponent implements OnInit {
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
		this.initialize();
	}
	
	setFocusedElement(element) {
		this.focusedElement = element;
	}
	
	initialize() {
		this.workingData = this.eventData.map(val => this.helper.getEventFromType(val));
	}
}
