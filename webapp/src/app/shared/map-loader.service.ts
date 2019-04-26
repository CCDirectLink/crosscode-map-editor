import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, BehaviorSubject} from 'rxjs';
import {CrossCodeMap} from '../models/cross-code-map';
import {CCMap} from './phaser/tilemap/cc-map';
import {CCMapLayer} from './phaser/tilemap/cc-map-layer';
import {ResourceManagerService} from './resource-manager.service';
import {Globals} from './globals';
@Injectable()
export class MapLoaderService {

	private _map: BehaviorSubject<CrossCodeMap> = new BehaviorSubject(null);
	tileMap: BehaviorSubject<CCMap> = new BehaviorSubject(null);
	selectedLayer: BehaviorSubject<CCMapLayer> = new BehaviorSubject(null);

	constructor(private snackBar: MatSnackBar) {
	}

	loadMap(event) {
		const files: FileList = event.target.files;
		if (files.length === 0) {
			return;
		}

		const file = files[0];
		const isPatched = file.name.endsWith(".patch");
		let filePath = file.path;
		if(isPatched) {
			filePath = filePath.substring(0, filePath.length - ".patch".length);
		}
		Globals.resourceManager.addAssetsPath(file.path);
		Globals.resourceManager.loadJSON("!", filePath, (map) => {
			console.log("Loaded map", map);
			if (!map.mapHeight) {
				throw new Error('invalid map');
			}
			map.filename = file.name;
			map.path = Globals.resourceManager.getRelativePath(filePath);
			map.patched = isPatched;
			this._map.next(map);
		});
	}

	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
}
