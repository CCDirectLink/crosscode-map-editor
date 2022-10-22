import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTile } from '../../models/tile-selector';

@Injectable({
	providedIn: 'root'
})
export class PhaserEventsService {
	
	changeSelectedTiles = new Subject<SelectedTile[]>();
	updateMapBorder = new Subject<boolean>();
	showMapBorder = new Subject<boolean>();
}
