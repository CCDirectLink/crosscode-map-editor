import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
import {FileInfos} from '../models/file-infos';
import {ElectronService} from './electron.service';
import {FileInfos} from '../models/file-infos';
import {api} from 'cc-map-editor-common';

@Injectable()
export class HttpClientService {
	
	private readonly fileName = 'config.json';
	
	constructor(
		private http: HttpClient,
		private electron: ElectronService) {
	}
	
	getAllFiles(): Observable<FileInfos> {
		if (!Globals.isElectron) {
			return this.http.get<FileInfos>(Globals.URL + 'api/allFiles');
		}
		return new Observable(obs => {
			obs.next(api.getAllFiles(this.electron.path.resolve(this.electron.getAssetsPath()) as FileInfos);
			obs.complete();
		});
	}
	
	getAllTilesets(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		return new Observable(obs => {
			obs.next(api.getAllTilesets(this.electron.path.resolve(this.electron.getAssetsPath()));
			obs.complete();
		});
	}
}
