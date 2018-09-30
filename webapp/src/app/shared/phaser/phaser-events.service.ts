import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import Point = Phaser.Point;

@Injectable({
	providedIn: 'root'
})
export class PhaserEventsService {
	cameraZoomUpdate: Subject<Point> = new Subject();
}
