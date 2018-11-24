import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-event-widget',
	templateUrl: './event-widget.component.html',
	styleUrls: ['./event-widget.component.scss', '../widget.scss']
})
export class EventWidgetComponent extends AbstractWidget {

	@Input() displayName;

	constructor() {
		super();
	}
	
	openEvent() {
		// TODO open event
		console.log('open event');
	}
}
