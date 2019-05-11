import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
import {Remote, Dialog} from 'electron';
import { FileInfos } from '../models/file-infos';
import { api } from 'cc-map-editor-common';

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
				this.setPathToCrossCode();
				this.normalizeCrossCodePath();
				const ccPath: string = this.getPathToCrossCode();

				Globals.URL = `file:///${ccPath}`;

			} catch (e) {
			}
		}
	}
	
	getAllFiles(): Observable<FileInfos> {
		if (!this.fs) {
			return this.http.get<FileInfos>(Globals.URL + 'api/allFiles');
		}
		return new Observable(obs => {
			const ccPath = this.getPathToCrossCode();

			if (ccPath) {
				obs.next(api.getAllFiles(ccPath) as FileInfos);
				obs.complete();
			}
		});
	}

	getAllTilesets(): Observable<string[]> {
		if (!this.fs) {
			return this.http.get<string[]>(Globals.URL + 'api/allTilesets');
		}
		return new Observable(obs => {
			const ccPath = this.getPathToCrossCode();
			if (ccPath) {
				obs.next(api.getAllTilesets(ccPath));
				obs.complete();
			}
		});
	}
	
	private setPathToCrossCode(): void {

		const ccConfig = JSON.parse(localStorage.getItem('config'));

		if (!ccConfig || !ccConfig.pathToCrosscode) {
			this.selectCcFolder();
		}
		this.config = ccConfig;
	}

	private normalizeCrossCodePath(): void {
		let ccPath = this.config.pathToCrosscode;
		if (ccPath.endsWith('\\')) {
			ccPath = ccPath.split('\\').join('/');
		}
		if (!ccPath.endsWith('/')) {
			ccPath += '/';
		}
		this.config.pathToCrosscode = ccPath;
	}

	getPathToCrossCode(): string {

		return this.config.pathToCrosscode;
	}

	private selectCcFolder() {
		
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialog({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		if (newPath && newPath.length) {
			localStorage.setItem('config', JSON.stringify({pathToCrosscode: newPath[0]}));
		}
		this.remote.app.relaunch();
		this.remote.app.exit();
	}
}
