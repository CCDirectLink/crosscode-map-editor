import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EditorView } from '../models/editor-view';
import { CCEntity } from '../renderer/phaser/entities/cc-entity';
import { MapEntity, Point } from '../models/cross-code-map';
import { SelectedTile } from '../models/tile-selector';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    public readonly currentView = new BehaviorSubject<EditorView | undefined>(undefined);
    
	public readonly selectedEntity = new BehaviorSubject<CCEntity | undefined>(undefined);
    public readonly generateNewEntity = new Subject<MapEntity>();
	public readonly showAddEntityMenu = new Subject<{ worldPos: Point, definitions: any }>();
    
	public readonly loadComplete = new Subject<void>();
	public readonly offsetMap = new Subject<Point>();
	public readonly generateHeights = new Subject<void>();
    public readonly toggleVisibility = new Subject<void>();
    
	public readonly changeSelectedTiles = new Subject<SelectedTile[]>();
	public readonly updateMapBorder = new Subject<boolean>();
}
