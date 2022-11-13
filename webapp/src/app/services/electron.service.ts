import { Injectable } from '@angular/core';
import { api } from 'cc-map-editor-common';
import { Globals } from './globals';
import { SharedService } from './shared-service';

@Injectable({
	providedIn: 'root'
})
export class ElectronService implements SharedService {
	private static readonly storageName = 'assetsPath';
	private static readonly modName = 'selectedMod';
	private static assetsPath = '';
	private static selectedMod = '';
	
	private readonly fs?: typeof import('fs');
	private readonly remote?: typeof import('@electron/remote');
	
	constructor() {
		if (!Globals.isElectron) {
			return;
		}
		
		this.remote = window.require('@electron/remote');
		this.fs = this.remote!.require('fs');
		
	}

	public static async init() {
		if (!Globals.isElectron) {
			return;
		}

		ElectronService.assetsPath = localStorage.getItem(ElectronService.storageName) || '';
		ElectronService.updateURL();
		ElectronService.selectedMod = localStorage.getItem(this.modName) || '';
		await ElectronService.updateMod();
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
	
	private static updateURL() {
		Globals.URL = 'file:///' + ElectronService.assetsPath;
	}

	private static async updateMod() {
		await api.selectedMod(ElectronService.assetsPath, ElectronService.selectedMod);
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
		const newPath = this.remote.dialog.showOpenDialogSync({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		
		return newPath ? newPath[0] : undefined;
	}
	
	public saveAssetsPath(path: string) {
		const normalized = ElectronService.normalizePath(path);
		ElectronService.assetsPath = normalized;
		localStorage.setItem(ElectronService.storageName, normalized);
		ElectronService.updateURL();
	}

	public async saveModSelect(mod: string) {
		localStorage.setItem(ElectronService.modName, mod);
		ElectronService.selectedMod = mod;
		await ElectronService.updateMod();
	}
	
	public getAssetsPath() {
		return ElectronService.assetsPath;
	}

	public getSelectedMod() {
		return ElectronService.selectedMod;
	}
}
