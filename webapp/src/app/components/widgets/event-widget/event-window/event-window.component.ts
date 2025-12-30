import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { EventArray } from '../../../../models/events';
import { EventEditorComponent } from '../event-editor/editor/event-editor.component';
import { EventHelperService } from '../event-editor/event-helper.service';
import { OverlayPanelComponent } from '../../../dialogs/overlay/overlay-panel/overlay-panel.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-event-window',
    templateUrl: './event-window.component.html',
    styleUrls: ['./event-window.component.scss', '../../widget.scss'],
    imports: [OverlayPanelComponent, EventEditorComponent, FlexModule, MatButton]
})
export class EventWindowComponent {
	private helper = inject(EventHelperService);

	
	@ViewChild('eventEditor', {static: false}) eventEditor!: EventEditorComponent;
	
	@Input() event: EventArray | unknown = [];
	@Input() actionStep = false;
	@Output() exit = new EventEmitter<EventArray>();
	
	save() {
		this.exit.emit(this.eventEditor.export());
		this.helper.selectedEvent.next(null);
	}
	
	cancel() {
		this.exit.error('cancel');
		this.helper.selectedEvent.next(null);
	}
}
