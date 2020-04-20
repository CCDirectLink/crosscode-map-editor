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
		return this.request('api/allFiles', api.getAllFiles);
	}
	
	getAllTilesets(): Observable<string[]> {
		return this.request('api/allTilesets', api.getAllTilesets);
	}
	
	getMaps(): Observable<string[]> {
		return this.request('api/allMaps', api.getAllMaps);
	}

	getMods(): Observable<string[]> {
		return this.request('api/allMods', api.getAllMods);
	}
	
	getAssetsFile<T>(path: string): Observable<T> {
		return this.http.get<T>(Globals.URL + path);
	}
	
	saveFile(path: string, content: any) {
		const file = {path: path, content: content};
		if (!Globals.isElectron) {
			return this.http.post(Globals.URL + 'api/saveFile', file);
		}
		
		return this.toObservable(api.saveFile(this.electron.getAssetsPath(), file));
	}

	/**
	 * Request a resource either from backend when run in the browser or directly from backend when run with Electron.
	 * @param url 		URL of the backend endpoint relative to Globals.URL
	 * @param common 	Direct call to common
	 */
	private request<T>(url: string, common: (path: string) => Promise<T>): Observable<T> {
		if (!Globals.isElectron) {
			return this.http.get<T>(Globals.URL + url);
		}
		const path = this.electron.getAssetsPath();
		return this.toObservable(common(path));
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
