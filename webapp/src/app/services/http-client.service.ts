import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {Globals} from '../shared/globals';
import {ElectronService} from './electron.service';
import {FileInfos} from '../models/file-infos';
import {api} from 'cc-map-editor-common';
import { CrossCodeMap } from '../models/cross-code-map';

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
		const path = this.electron.getAssetsPath();
		return from(api.getAllFiles(path) as Promise<FileInfos>);
	}
	
	getAllTilesets(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		const path = this.electron.getAssetsPath();
		return from(api.getAllTilesets(path));
	}
	
	getMaps(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allMaps');
		}
		const path = this.electron.getAssetsPath();
		return from(api.getAllMaps(path));
	}

	getMap(path: string): Observable<CrossCodeMap> {
		return this.http.get<CrossCodeMap>(`${Globals.URL}data/maps/${path.replace(/\./g, '/')}.json`);
	}
}
