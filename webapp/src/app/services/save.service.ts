import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {MatSnackBar} from '@angular/material';

@Injectable({
	providedIn: 'root'
})
export class SaveService {
	
	constructor(
		private http: HttpClientService,
		private snackbar: MatSnackBar
	) {
	}
	
	saveMap(map: CCMap) {
		if (!map.path) {
			console.error('map has no path :/');
			return this.saveMapAs(map);
		}
		this.http.saveFile(map.path, JSON.stringify(map.exportMap())).subscribe(msg => {
			console.log(msg);
			this.snackbar.open(msg as string, 'ok', {duration: 3000});
		}, err => {
			console.error(err);
			this.snackbar.open('failed to save map', 'ok');
		});
	}
	
	saveMapAs(map: CCMap) {
		const file = new Blob([JSON.stringify(map.exportMap(), null, 2)], {type: 'application/json'});
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
}
