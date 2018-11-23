import {Component, OnChanges, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import {AbstractEvent} from '../../event-registry/abstract-event';

@Component({
	selector: 'app-event-row',
	templateUrl: './event-row.component.html',
	styleUrls: ['./event-row.component.scss'],
})
export class EventRowComponent implements OnInit {
	@Input() data;
	
	constructor() {
	}
	
	ngOnInit(): void {
	}
	
}
