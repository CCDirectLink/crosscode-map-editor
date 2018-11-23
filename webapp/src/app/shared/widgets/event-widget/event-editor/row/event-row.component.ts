import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-event-row',
	templateUrl: './event-row.component.html',
	styleUrls: ['./event-row.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventRowComponent implements OnInit {
	@Input() data = {};
	@Input() isLast = false;
	
	constructor() {
	}
	
	ngOnInit(): void {
	}
	
}
