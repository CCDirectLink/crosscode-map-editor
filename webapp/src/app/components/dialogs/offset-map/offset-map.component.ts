import { Component } from '@angular/core';
import { Point } from '../../../models/cross-code-map';
import { GlobalEventsService } from '../../../services/global-events.service';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { Globals } from '../../../services/globals';
import { StateHistoryService } from '../floating-window/history/state-history.service';

@Component({
	selector: 'app-offset-map',
	templateUrl: './offset-map.component.html',
	styleUrls: ['./offset-map.component.scss']
})
export class OffsetMapComponent {
	
	offset: Point = {x: 0, y: 0};
	entities = false;
	
	constructor(
		private events: GlobalEventsService,
		private history: StateHistoryService,
		public ref: OverlayRefControl,
	) {
	}
	
	update() {
		if (this.offset.x === 0 && this.offset.y === 0) {
			return;
		}
		this.events.offsetMap.next(this.offset);
		if (this.entities) {
			this.events.offsetEntities.next({
				x: this.offset.x * Globals.TILE_SIZE,
				y: this.offset.y * Globals.TILE_SIZE,
			});
		}
		this.history.saveState({
			name: 'Offset map',
			icon: 'open_with'
		}, true);
		
		this.ref.close();
	}
}
