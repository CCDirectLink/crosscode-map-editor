import {Component, OnChanges, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {EventEditorComponent} from '../event-editor/editor/event-editor.component';
import {EventType} from '../event-registry/abstract-event';

@Component({
	selector: 'app-event-window',
	templateUrl: './event-window.component.html',
	styleUrls: ['./event-window.component.scss', '../../widget.scss'],
})
export class EventWindowComponent {
	
	@ViewChild('eventEditor', { static: false }) eventEditor!: EventEditorComponent;
	
	@Input() event!: EventType[];
	@Input() actionStep = false;
	@Output() exit = new EventEmitter<EventType[]>();
	
	constructor() {
	}
	
	save() {
		this.exit.emit(this.eventEditor.export());
	}
	
	cancel() {
		this.exit.error('cancel');
	}
}
