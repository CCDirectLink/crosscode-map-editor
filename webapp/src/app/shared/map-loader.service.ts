import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, BehaviorSubject} from 'rxjs';
import {CrossCodeMap} from '../models/cross-code-map';
import {CCMap} from './phaser/tilemap/cc-map';
import {CCMapLayer} from './phaser/tilemap/cc-map-layer';

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
		const reader = new FileReader();

		reader.onload = (e: any) => {
			try {
				const map = JSON.parse(e.target.result);
				if (!map.mapHeight) {
					throw new Error('invalid map');
				}
				map.filename = file.name;
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

	loadEmptyMap() {
		const emptyMap: CrossCodeMap = {
			filename: 'Untitled.json',
			name : 'Untitled',
			levels: [{
				height: 0
			}],
			mapWidth: 30,
			mapHeight: 30,
			masterLevel: 0,
			layer: [{
				type: 'Background',
				level: 0,
				name : 'Empty',
				width: 50,
				height: 50,
				visible: 1,
				tilesetName: 'media/map/cargo-ship-inner.png',
				repeat: false,
				distance: 0,
				tilesize: 16,
				moveSpeed: {
					x: 1,
					y: 1
				},
				data: []
			}],
			entities: [],
			attributes: {
				saveMode: '',
				bgm: '',
				cameraInBounds: false,
				'map-sounds': '',
				mapStyle: '',
				weather: '',
				npcRunners: '',
				area: ''
			},
			screen: {
				x: 0,
				y: 0
			}
		};
		this._map.next(emptyMap);
	}

	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
}
