import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
import {FileInfos} from '../models/file-infos';
import {ElectronService} from './electron.service';

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
			const o = {
				images: this.listAllFiles(this.electron.path.resolve(this.electron.getAssetsPath(), 'media/'), [], 'png'),
				data: this.listAllFiles(this.electron.path.resolve(this.electron.getAssetsPath(), 'data/'), [], 'json')
			} as FileInfos;
			
			obs.next(o);
			obs.complete();
		});
	}
	
	getAllTilesets(): Observable<string[]> {
		if (!Globals.isElectron) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		return new Observable(obs => {
			obs.next(this.listAllFiles(this.electron.path.resolve(this.electron.getAssetsPath(), 'media/map/'), [], 'png'));
			obs.complete();
		});
	}
	
	private listAllFiles(dir: string, filelist: string[], ending: string): string[] {
		const fs = this.electron.fs;
		const path = this.electron.path;
		const files = fs.readdirSync(dir);
		filelist = filelist || [];
		files.forEach(file => {
			if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
				filelist = this.listAllFiles(path.resolve(dir, file), filelist, ending);
			} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
				let normalized = path.resolve(dir, file).split(path.normalize(this.electron.getAssetsPath()))[1];
				normalized = normalized.split('\\').join('/');
				if (normalized.startsWith('/')) {
					normalized = normalized.substr(1);
				}
				filelist.push(normalized);
			}
		});
		return filelist;
	}
}
