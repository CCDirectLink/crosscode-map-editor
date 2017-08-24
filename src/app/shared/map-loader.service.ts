import {Injectable} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {CrossCodeMap} from './interfaces/cross-code-map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CCMap} from './phaser/tilemap/cc-map';
import {CCMapLayer} from './phaser/tilemap/cc-map-layer';

@Injectable()
export class MapLoaderService {

	private _map: BehaviorSubject<CrossCodeMap> = new BehaviorSubject(null);
	tileMap: BehaviorSubject<CCMap> = new BehaviorSubject(null);
	selectedLayer: BehaviorSubject<CCMapLayer> = new BehaviorSubject(null);

	constructor(private snackBar: MdSnackBar) {
	}

	loadMap(event) {
		const files: FileList = event.target.files;
		if (files.length === 0) {
			return;
		}

		const file = files[0];
		const reader = new FileReader();

		reader.onload = (e: any) => {
			try {
				const map = JSON.parse(e.target.result);
				if (!map.mapHeight || !map.layer[0].type) {
					throw new Error('invalid map');
				}
				this._map.next(map);
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

	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
}
