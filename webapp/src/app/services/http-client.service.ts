import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from 'cc-map-editor-common';
import { Observable } from 'rxjs';
import { ElectronService } from './electron.service';
import { Globals } from './globals';

@Injectable({
	providedIn: 'root',
})
export class HttpClientService {
	private http = inject(HttpClient);
	private electron = inject(ElectronService);
	
	getModMapEditorConfigs() {
		// TODO: fs-access
		return [] as any[];
		// return lastValueFrom(this.request('api/allModMapEditorConfigs', api.getAllModMapEditorConfigs));
	}
	
	getAssetsFile<T>(path: string): Observable<T> {
		if (!Globals.isElectron) {
			return this.http.post<T>(Globals.URL + 'api/get', { path });
		}
		const cc = this.electron.getAssetsPath();
		return this.toObservable(api.get<T>(cc, path));
	}
	
	saveFile(path: string, content: any): Observable<string> {
		const file = { path: path, content: content };
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
	private request<T, A extends unknown[]>(url: string, common: (path: string, ...args: A) => Promise<T>, ...args: A): Observable<T> {
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
