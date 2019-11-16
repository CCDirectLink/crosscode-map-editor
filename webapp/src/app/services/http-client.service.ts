import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
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
		const path = this.electron.getAssetsPath(true);
		return this.toObservable(api.getAllFiles(path) as Promise<FileInfos>);
	}
	
	getAllTilesets(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		const path = this.electron.getAssetsPath(true);
		return this.toObservable(api.getAllTilesets(path));
	}
	
	getMaps(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allMaps');
		}
		const assetsPath = this.electron.getAssetsPath(true);
		return this.toObservable(api.getAllMaps(assetsPath));
	}
	
	getAssetsFile<T>(path: string): Observable<T> {
		if (!Globals.isElectron) {
			return this.http.get<T>(Globals.URL + path);
		}
		const assetsPath = this.electron.getAssetsPath(true);
		return this.http.get<T>(`file://${assetsPath}` + path);
		
	}
	
	saveFile(path: string, content: any) {
		const file = {path: path, content: content};
		if (!Globals.isElectron) {
			return this.http.post(Globals.URL + 'api/saveFile', file);
		}
		const assetsPath = this.electron.getAssetsPath(true);
		return this.toObservable(api.saveFile(assetsPath, file));
	}
	
	private toObservable<T>(promise: Promise<T>): Observable<T> {
		return new Observable<T>(subsriber => {
			promise
				.then(value => subsriber.next(value))
				.catch(err => subsriber.error(err))
				.finally(() => subsriber.complete());
		});
	}
}
