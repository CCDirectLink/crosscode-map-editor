import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EditorView} from './interfaces/editor-view';
import {CCEntity} from './phaser/entities/cc-entity';
import {Subject} from 'rxjs/Subject';
import {Point} from './interfaces/cross-code-map';

@Injectable()
export class GlobalEventsService {

	currentView: BehaviorSubject<EditorView> = new BehaviorSubject(null);
	selectedEntity: BehaviorSubject<CCEntity> = new BehaviorSubject(null);
	showAddEntityMenu: Subject<{ show: boolean, definitions: any }> = new Subject();

	constructor() {
	}

}
