import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {WidgetModule} from '../../widget.module';

@Injectable()
export class EventStorageService {
	
	selectedEvent: BehaviorSubject<any> = new BehaviorSubject(null);
	
	constructor() {
	}
	
}
