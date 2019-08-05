import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../../services/loader.service';
import {MatDialogRef} from '@angular/material';
import {Point} from '../../../models/cross-code-map';
import {GlobalEventsService} from '../../../renderer/global-events.service';

@Component({
	selector: 'app-offset-map',
	templateUrl: './offset-map.component.html',
	styleUrls: ['./offset-map.component.scss']
})
export class OffsetMapComponent {
	
	offset: Point;
	
	constructor(private events: GlobalEventsService, public ref: MatDialogRef<OffsetMapComponent>) {
		this.offset = {x: 0, y: 0};
	}
	
	update() {
		this.events.offsetMap.next(this.offset);
		this.ref.close();
	}
}
