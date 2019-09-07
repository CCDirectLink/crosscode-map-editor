import {Injectable} from '@angular/core';
import {Globals} from '../shared/globals';
import {Dialog, Remote} from 'electron';
import * as nodeFs from 'fs';

@Injectable()
export class ElectronService {
	
	private readonly fs?: typeof nodeFs;
	
	private storageName = 'assetsPath';
	private assetsPath = '';
	private readonly remote?: Remote;
	
	constructor() {
		if (!Globals.isElectron) {
			return;
		}
		
		// @ts-ignore
		const {remote, ipcRenderer} = window.require('electron');
		
		// @ts-ignore
		this.ipcRenderer = ipcRenderer;
		
		this.remote = remote!;
		
		this.fs = remote.require('fs');
		
		this.assetsPath = localStorage.getItem(this.storageName) || '';
		this.updateURL();
	}
	
	private static normalizePath(p: string) {
		if (p.endsWith('\\')) {
			p = p.split('\\').join('/');
		}
		if (!p.endsWith('/')) {
			p += '/';
		}
		return p;
	}
	
	private updateURL() {
		Globals.URL = 'file:///' + this.assetsPath;
	}
	
	public relaunch() {
		if (!this.remote) {
			throw new Error('remote is not defined');
		}
		this.remote.app.relaunch();
		this.remote.app.quit();
	}
	
	public checkAssetsPath(path: string): boolean {
		if (!this.fs) {
			return false;
		}
		try {
			const files = this.fs.readdirSync(path);
			return files.includes('data') && files.includes('media');
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	
	public selectCcFolder(): string | undefined {
		if (!this.remote) {
			throw new Error('remote is not defined');
		}
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialog({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		
		return newPath ? newPath[0] : undefined;
	}
	
	public saveAssetsPath(path: string) {
		const normalized = ElectronService.normalizePath(path);
		this.assetsPath = normalized;
		localStorage.setItem(this.storageName, normalized);
		this.updateURL();
	}
	
	public getAssetsPath() {
		return this.assetsPath;
	}

	public checkForUpdate(): Promise<any> {
		// @ts-ignore
		if (!this.ipcRenderer) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			// @ts-ignore
			this.ipcRenderer.once('update-check-result', (event, args) => {
				resolve(args);
			});

			// @ts-ignore
			this.ipcRenderer.send('update-check', '');			
		});
	}

	public downloadUpdate(): Promise<any>  {
		if (!this.ipcRenderer) {
			return Promise.reject();
		}

		
		return new Promise((resolve, reject) => {
			// @ts-ignore
			this.ipcRenderer.once('update-download-result', (event, args) => {
				resolve(args);
				console.log('Update results', args);
			});

			// @ts-ignore
			this.ipcRenderer.send('update-download', '');			
		});		
	}
}
