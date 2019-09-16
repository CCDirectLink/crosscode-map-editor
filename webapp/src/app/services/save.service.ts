import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {MatSnackBar} from '@angular/material';
import {Helper} from '../shared/phaser/helper';
import {EventManager} from '@angular/platform-browser';
import {MapLoaderService} from '../shared/map-loader.service';

@Injectable({
	providedIn: 'root'
})
export class SaveService {
	
	constructor(
		private http: HttpClientService,
		private snackbar: MatSnackBar,
		mapLoader: MapLoaderService,
		eventManager: EventManager
	) {
		eventManager.addEventListener(document as any, 'keydown', (event: KeyboardEvent) => {
			if (Helper.isInputFocused()) {
				return;
			}
			
			if (event.ctrlKey && event.key.toLowerCase() === 's') {
				event.preventDefault();
				const map = mapLoader.tileMap.getValue();
				if (!map) {
					return;
				}
				if (event.shiftKey) {
					this.saveMapAs(map);
				} else {
					this.saveMap(map);
				}
			}
		});
	}
	
	saveMap(map: CCMap) {
		if (!map.path) {
			console.error('map has no path :/');
			return this.saveMapAs(map);
		}
		this.http.saveFile(map.path, this.generateMapJson(map)).subscribe(msg => {
			console.log(msg);
			this.snackbar.open('successfully saved map', 'ok', {duration: 3000});
		}, err => {
			console.error(err);
			this.snackbar.open('failed to save map', 'ok');
		});
	}
	
	saveMapAs(map: CCMap) {
		const file = new Blob([this.generateMapJson(map)], {type: 'application/json'});
		const a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = map.filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
	
	private generateMapJson(map: CCMap) {
		const out = map.exportMap();
		out.path = undefined;
		out.filename = undefined;
		return JSON.stringify(out);
	}
}
