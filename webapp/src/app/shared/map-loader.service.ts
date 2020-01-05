import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BehaviorSubject, Observable} from 'rxjs';
import {CrossCodeMap, MapContext} from '../models/cross-code-map';
import {CCMap} from './phaser/tilemap/cc-map';
import {CCMapLayer} from './phaser/tilemap/cc-map-layer';
import {HttpClientService} from '../services/http-client.service';
import {Globals} from './globals';
import {GlobalEventsService} from './global-events.service';
import {ElectronService} from '../services/electron.service';
import {BasePath, FileExtension, PathResolver} from './path-resolver';

@Injectable()
export class MapLoaderService {
	
	private _map = new BehaviorSubject<CrossCodeMap>(undefined as any);
	tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);
	private pathOverride = ''; 
	constructor(
		private snackBar: MatSnackBar,
		private http: HttpClientService,
		private electron: ElectronService,
		private eventService: GlobalEventsService
	) {
		this.eventService.changeMapContext.subscribe(({name, path: mapPath}: any) => {
			if (name !== 'BASE') {
				this.pathOverride = mapPath;
			} else {
				this.pathOverride = '';
			}
		});
	}
	
	loadMap(event: Event) {
		const files: FileList = (event.target as HTMLInputElement).files!;
		if (files.length === 0) {
			return;
		}
		
		const file = files[0];
		const reader = new FileReader();
		
		reader.onload = (e: any) => {
			try {
				const map = JSON.parse(e.target.result);
				let path: string | undefined;
				if (file.path && Globals.isElectron) {
					path = file.path.split(this.electron.getAssetsPath())[1];
				}
				this.loadRawMap(map, file.name, path);
			} catch (e) {
				console.error(e);
				this.snackBar.open('Error: ' + e.message, undefined, {
					duration: 2500
				});
				return;
			}
		};
		
		reader.readAsText(file);
	}
	
	loadRawMap(map: CrossCodeMap, name?: string, path?: string) {
		if (!map.mapHeight) {
			throw new Error('Invalid map');
		}
		map.filename = name;
		map.path = path;
		this._map.next(map);
	}
	
	loadMapByName(mapContext: MapContext, name: string) {
		const path = PathResolver.convertToPath(mapContext, BasePath.MAPS, name, FileExtension.JSON);
		
		this.http.getAssetsFile<CrossCodeMap>(path).subscribe(map => {
			this.loadRawMap(map, name, path);
		});
	}
	
	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
}
