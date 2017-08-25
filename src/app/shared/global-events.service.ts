import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EditorView} from './interfaces/editor-view';

@Injectable()
export class GlobalEventsService {

	currentView: BehaviorSubject<EditorView> = new BehaviorSubject(null);

	constructor() {
	}

}
