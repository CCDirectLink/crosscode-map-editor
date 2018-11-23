import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-event-widget',
	templateUrl: './event-widget.component.html',
	styleUrls: ['./event-widget.component.scss', '../widget.scss']
})
export class EventWidgetComponent extends AbstractWidget implements OnInit, OnChanges {

	@Input() custom = null;
	@Input() displayName;
	
	settings;

	constructor() {
		super();
	}

	ngOnInit() {
		this.ngOnChanges(null);
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.settings = this.custom || this.entity.details.settings;
	}
	
	openEvent() {
		// TODO open event
		console.log('open event');
	}
}
