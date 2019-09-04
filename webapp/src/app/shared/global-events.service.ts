import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {EditorView} from '../models/editor-view';
import {CCEntity} from './phaser/entities/cc-entity';
import {MapEntity, Point} from '../models/cross-code-map';

@Injectable()
export class GlobalEventsService {

	currentView = new BehaviorSubject<EditorView | undefined>(undefined);
	selectedEntity = new BehaviorSubject<CCEntity | undefined>(undefined);
	generateNewEntity = new Subject<MapEntity>();
	loadComplete = new Subject<void>();
	generateHeights = new Subject<boolean>();
	offsetMap = new Subject<Point>();
	toggleVisibility = new Subject<void>();
	showAddEntityMenu = new Subject<Point>();

	constructor() {
	}

}
