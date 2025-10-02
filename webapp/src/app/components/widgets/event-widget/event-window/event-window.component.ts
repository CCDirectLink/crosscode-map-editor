import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EventArray } from '../../../../models/events';
import { EventEditorComponent } from '../event-editor/editor/event-editor.component';
import { EventHelperService } from '../event-editor/event-helper.service';

@Component({
	selector: 'app-event-window',
	templateUrl: './event-window.component.html',
	styleUrls: ['./event-window.component.scss', '../../widget.scss'],
	standalone: false
})
export class EventWindowComponent {
	
	@ViewChild('eventEditor', {static: false}) eventEditor!: EventEditorComponent;
	
	@Input() event: EventArray | unknown = [];
	@Input() actionStep = false;
	@Output() exit = new EventEmitter<EventArray>();
	
	constructor(
		private helper: EventHelperService
	) {
	}
	
	save() {
		this.exit.emit(this.eventEditor.export());
		this.helper.selectedEvent.next(null);
	}
	
	cancel() {
		this.exit.error('cancel');
		this.helper.selectedEvent.next(null);
	}
}
