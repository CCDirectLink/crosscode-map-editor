import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MapEntity, Point, Point3 } from '../models/cross-code-map';
import { EditorView } from '../models/editor-view';
import { CCEntity } from './phaser/entities/cc-entity';

@Injectable({
	providedIn: 'root'
})
export class GlobalEventsService {
	currentView = new BehaviorSubject<EditorView | undefined>(undefined);
	selectedEntity = new BehaviorSubject<CCEntity | undefined>(undefined);
	updateEntitySettings = new Subject<CCEntity>();
	generateNewEntity = new Subject<MapEntity>();
	filterEntity = new Subject<string>();
	loadComplete = new Subject<void>();
	generateHeights = new Subject<boolean>();
	offsetMap = new Subject<Point>();
	offsetEntities = new Subject<Point>();
	toggleVisibility = new Subject<void>();
	showAddEntityMenu = new Subject<Point>();

	updateCoords = new Subject<Point3 | undefined>();
	updateTileSelectionSize = new Subject<Point | undefined>();
	showIngamePreview = new BehaviorSubject(false);
	hasUnsavedChanges = new BehaviorSubject(false);

	babylonLoading = new BehaviorSubject<boolean>(false);
	is3D = new BehaviorSubject<boolean>(false);

	constructor() {}
}
