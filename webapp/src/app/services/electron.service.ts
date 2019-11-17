import {Injectable} from '@angular/core';
import {Globals} from '../shared/globals';
import {Dialog, Remote} from 'electron';
import * as nodeFs from 'fs';
import * as nodePath from 'path';
import {api} from 'cc-map-editor-common';
import {GlobalEventsService} from '../shared/global-events.service';

@Injectable()
export class ElectronService {
	
	private readonly fs?: typeof nodeFs;
	private readonly path?: typeof nodePath;
	private storageName = 'assetsPath';
	private assetsPath = '';
	private allModsAssetsPath: Map<string, any> = new Map();
	private	overrideModName = '';
	private overrideStorageName = 'overrideModName';
	private readonly remote?: Remote;
	
	constructor(
		private globalEvents: GlobalEventsService
	) {
		if (!Globals.isElectron) {
			return;
		}
		
		// @ts-ignore
		const remote = window.require('electron').remote;
		this.remote = remote!;
		this.fs = remote.require('fs');
		this.path = remote.require('path');
		// @ts-ignore
		this.assetsPath = this.path.normalize(localStorage.getItem(this.storageName) || '');
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
		const oldUrl: string = Globals.URL;
		const newUrl = 'file:///' + this.assetsPath;
		if (oldUrl !== newUrl) {
			Globals.URL = newUrl;
			this.resetModsAssetsPath();
		}
	}
	
	private resetModsAssetsPath() {
		if (!this.path) {
			return;
		}
		this.overrideModName = '';
		const modsPaths = api.getAllMods(this.assetsPath);
		for (let i = 0; i < modsPaths.length; ++i) {
			const modAssetsPath = this.path.join(modsPaths[i].path, 'assets/');
			if (!this.checkModAssetsPath(modAssetsPath)) {
				modsPaths.splice(i, 1);
				--i;
				continue;
			}
			modsPaths[i].path = modAssetsPath;
			this.allModsAssetsPath.set(modsPaths[i].name, modsPaths[i]);
		}
		const modName = localStorage.getItem(this.overrideStorageName);
		if (modName) {
			this.overrideModName = modName;
			this.globalEvents.assetsPathChange.next(modName);
		} 
	}

	public hasModOverride() {
		return this.overrideModName !== '';
	}

	public setModOverride(modName: string) {
		this.overrideModName = modName;
		this.globalEvents.assetsPathChange.next(modName);
		localStorage.setItem(this.overrideStorageName, modName);
	}

	public getModOverride() {
		return this.overrideModName;
	}

	public getValidModNames() {
		return Array.from(this.allModsAssetsPath).map(e => e[0]);
	}

	public relaunch() {
		if (!this.remote) {
			throw new Error('remote is not defined');
		}
		this.remote.app.relaunch();
		this.remote.app.quit();
	}
	
	public checkModAssetsPath(path: string) {
		if (!this.fs) {
			return false;
		}
		try {
			return this.fs.readdirSync(path).includes('data');
		} catch (e) {}
		return false;
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

	public getAssetsPath(allowOverride = false) {
		let assetsPath = this.assetsPath;
		if (allowOverride) {
			if (this.overrideModName) {
				assetsPath = this.allModsAssetsPath.get(this.overrideModName).path;
			}
		}
		return assetsPath;
	}

	public getRelativeAssetsPath(allowOverride = false) {
		if (!this.path) {
			return '';
		}

		let relativeAssetsPath = this.path.normalize(this.getAssetsPath(allowOverride));
		let baseAssetsPath = this.path.normalize(this.getAssetsPath(false));

		return ElectronService.normalizePath(relativeAssetsPath.replace(baseAssetsPath, ''));
	}
}
