import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from 'cc-map-editor-common';
import { Observable } from 'rxjs';
import { FileInfos } from '../models/file-infos';
import { ElectronService } from './electron.service';
import { Globals } from './globals';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root'
})
export class HttpClientService {
	
	private readonly fileName = 'config.json';
	
	constructor(
		private http: HttpClient,
		private electron: ElectronService,
		private settingsService: SettingsService
	) {
	}
	
	getAllFiles(): Observable<FileInfos> {
		return this.request('api/allFiles', api.getAllFiles);
	}
	
	getAllTilesets(): Observable<string[]> {
		return this.request('api/allTilesets', api.getAllTilesets);
	}
	
	getMaps(): Observable<string[]> {
		const includeVanillaMaps: boolean = this.settingsService.includeVanillaMaps
		return this.request(`api/allMaps?includeVanillaMaps=${includeVanillaMaps}`, api.getAllMaps, includeVanillaMaps ? 'true' : 'false');
	}
	
	getProps(): Observable<string[]> {
		const folder = 'data/props/';
		const extension = 'json';
		return this.request(`api/allFilesInFolder?folder=${folder}&extension=${extension}`, api.getAllFilesInFolder, folder, extension);
	}
	
	getScalableProps(): Observable<string[]> {
		const folder = 'data/scale-props/';
		const extension = 'json';
		return this.request(`api/allFilesInFolder?folder=${folder}&extension=${extension}`, api.getAllFilesInFolder, folder, extension);
	}
	
	getEnemies(): Observable<string[]> {
		const folder = 'data/enemies/';
		const extension = 'json';
		return this.request(`api/allFilesInFolder?folder=${folder}&extension=${extension}`, api.getAllFilesInFolder, folder, extension);
	}
	
	getCharacters(): Observable<string[]> {
		const folder = 'data/characters/';
		const extension = 'json';
		return this.request(`api/allFilesInFolder?folder=${folder}&extension=${extension}`, api.getAllFilesInFolder, folder, extension);
	}
	
	getMods(): Observable<string[]> {
		return this.request('api/allMods', api.getAllMods);
	}
	
	getAssetsFile<T>(path: string): Observable<T> {
		if (!Globals.isElectron) {
			return this.http.post<T>(Globals.URL + 'api/get', {path});
		}
		const cc = this.electron.getAssetsPath();
		return this.toObservable(api.get<T>(cc, path));
	}
	
	resolveFile(path: string): Observable<string> {
		if (!Globals.isElectron) {
			return this.http.post<string>(Globals.URL + 'api/resolve', {path});
		}
		const cc = this.electron.getAssetsPath();
		return this.toObservable(api.resolve(cc, path));
	}
	
	saveFile(path: string, content: any): Observable<string> {
		const file = {path: path, content: content};
		if (!Globals.isElectron) {
			return this.http.post<string>(Globals.URL + 'api/saveFile', file);
		}
		
		return this.toObservable(api.saveFile(this.electron.getAssetsPath(), file));
	}
	
	/**
	 * Request a resource either from backend when run in the browser or directly from backend when run with Electron.
	 * @param url 		URL of the backend endpoint relative to Globals.URL
	 * @param common 	Direct call to common
	 * @param args      Additional arguments for common
	 */
	private request<T>(url: string, common: (path: string, ...args: string[]) => Promise<T>, ...args: string[]): Observable<T> {
		if (!Globals.isElectron) {
			return this.http.get<T>(Globals.URL + url);
		}
		const path = this.electron.getAssetsPath();
		return this.toObservable(common(path, ...args));
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
