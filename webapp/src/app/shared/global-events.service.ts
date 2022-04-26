import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {EditorView} from '../models/editor-view';
import {CCEntity} from './phaser/entities/cc-entity';
import {MapEntity, Point} from '../models/cross-code-map';
import { CoordsData } from './phaser/coords-reporter';

@Injectable()
export class GlobalEventsService {

	currentView = new BehaviorSubject<EditorView | undefined>(undefined);
	selectedEntity = new BehaviorSubject<CCEntity | undefined>(undefined);
	updateEntitySettings = new Subject<CCEntity>();
	generateNewEntity = new Subject<MapEntity>();
	filterEntity = new Subject<string>();
	loadComplete = new Subject<void>();
	generateHeights = new Subject<boolean>();
	offsetMap = new Subject<Point>();
	toggleVisibility = new Subject<void>();
	showAddEntityMenu = new Subject<Point>();

  updateCoords = new Subject<CoordsData>();
	
	babylonLoading = new BehaviorSubject<boolean>(false);
	is3D = new BehaviorSubject<boolean>(false);

	constructor() {
	}

}
