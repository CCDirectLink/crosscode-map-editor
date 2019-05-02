import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
import {Remote, Dialog} from 'electron';
import { FileInfos } from '../models/file-infos';
import { listAllFiles } from 'cc-map-editor-common/dist/controllers/api';

@Injectable()
export class HttpClientService {
	
	private readonly fileName = 'config.json';
	
	private readonly remote: Remote;
	private readonly fs;
	private readonly path;
	private config: { pathToCrosscode: string };
	private configPath: string;
	private isClicked = false;
	
	constructor(private http: HttpClient) {
		if (Globals.isElectron) {
			// @ts-ignore
			this.remote = window.require('electron').remote;
			this.fs = this.remote.require('fs');
			this.path = this.remote.require('path');
			this.configPath = this.path.join(this.remote.app.getPath('userData'), this.fileName);
			
			try {
				this.config = JSON.parse(this.fs.readFileSync(this.configPath));
				let p = this.config.pathToCrosscode;
				if (p.endsWith('\\')) {
					p = p.split('\\').join('/');
				}
				if (!p.endsWith('/')) {
					p += '/';
				}
				Globals.URL = 'file:///' + p;
				this.config.pathToCrosscode = p;
			} catch (e) {
			}
		}
	}
	
	getAllFiles(): Observable<FileInfos> {
		if (!this.fs) {
			return this.http.get<FileInfos>(Globals.URL + 'api/allFiles');
		}
		return new Observable(obs => {
			if (this.config && this.config.pathToCrosscode) {
				const o = {
					images: listAllFiles(this.path.resolve(this.config.pathToCrosscode, 'media/'), [], 'png'),
					data: listAllFiles(this.path.resolve(this.config.pathToCrosscode, 'data/'), [], 'json')
				} as FileInfos;
				
				obs.next(o);
				obs.complete();
			} else {
				console.warn('path to crosscode not found, opening file dialog');
				this.selectCcFolder();
			}
		});
	}

	getAllTilesets(): Observable<string[]> {
		if (!this.fs) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		return new Observable(obs => {
			if (this.config && this.config.pathToCrosscode) {
				obs.next(listAllFiles(this.path.resolve(this.config.pathToCrosscode, 'media/map/'), [], 'png'));
				obs.complete();
			} else {
				console.warn('path to crosscode not found, opening file dialog');
				this.selectCcFolder();
			}
		});
	}
	
	private selectCcFolder() {
		
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialog({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		
		this.fs.writeFileSync(this.configPath, JSON.stringify({pathToCrosscode: newPath[0]}, null, 2));
		this.remote.app.relaunch();
		this.remote.app.exit();
	}
}
