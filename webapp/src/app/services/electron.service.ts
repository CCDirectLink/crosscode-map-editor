import { Injectable } from '@angular/core';
import { Dialog, Remote } from 'electron';
import * as nodeFs from 'fs';
import { SettingsService } from './settings.service';

@Injectable()
export class ElectronService {
	private readonly fs?: typeof nodeFs;

	private storageName = 'assetsPath';
	private assetsPath = '';
	private readonly remote?: Remote;

	constructor(
		private readonly settings: SettingsService
	) {
		if (!settings.isElectron || !window.require) {
			return;
		}

		this.remote = window.require('electron').remote;
		this.fs = this.remote.require('fs');

		this.assetsPath = localStorage.getItem(this.storageName) || '';
		this.updateURL();
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
		const normalized = this.normalizePath(path);
		this.assetsPath = normalized;
		localStorage.setItem(this.storageName, normalized);
		this.updateURL();
	}

	public getAssetsPath() {
		return this.assetsPath;
	}
	

	private normalizePath(p: string) {
		if (p.endsWith('\\')) {
			p = p.split('\\').join('/');
		}
		if (!p.endsWith('/')) {
			p += '/';
		}
		return p;
	}

	private updateURL() {
		this.settings.URL = 'file:///' + this.assetsPath;
	}
}
