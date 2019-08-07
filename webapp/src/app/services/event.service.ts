import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EditorView } from '../models/editor-view';
import { CCEntity } from '../renderer/phaser/entities/cc-entity';
import { MapEntity, Point } from '../models/cross-code-map';
import { SelectedTile } from '../models/tile-selector';
import { CCMap } from '../renderer/phaser/tilemap/cc-map';
import { CCMapLayer } from '../renderer/phaser/tilemap/cc-map-layer';

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
	
	public readonly tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	public readonly selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);
}
