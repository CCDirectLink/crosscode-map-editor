import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';

@Component({
	selector: 'app-event-row',
	templateUrl: './event-row.component.html',
	styleUrls: ['./event-row.component.scss']
})
export class EventRowComponent implements OnInit {
	@Input() data: AbstractEvent<any> = <any>{};
	@Input() parent: AbstractEvent<any> = <any>{};
	
	constructor() {
	}
	
	ngOnInit(): void {
	}
	
}
