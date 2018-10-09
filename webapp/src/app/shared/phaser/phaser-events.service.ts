import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import Point = Phaser.Point;

@Injectable({
	providedIn: 'root'
})
export class PhaserEventsService {
	// TODO: event should be informational (camera zoomed/map size changed) instead of a command
	updateMapBorder: Subject<boolean> = new Subject();
}
