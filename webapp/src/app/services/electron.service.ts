import {Injectable} from '@angular/core';
import {Globals} from '../shared/globals';
import {Remote, Dialog} from 'electron';

@Injectable()
export class ElectronService {
	
	public readonly path;
	public readonly fs;
	
	private config: { pathToCrosscode: string };
	private readonly fileName = 'config.json';
	private readonly remote: Remote;
	private readonly configPath: string;
	
	constructor() {
		if (!Globals.isElectron) {
			return;
		}
		
		// @ts-ignore
		this.remote = window.require('electron').remote;
		this.fs = this.remote.require('fs');
		this.path = this.remote.require('path');
		this.configPath = this.path.join(this.remote.app.getPath('userData'), this.fileName);
		
		this.config = JSON.parse(this.fs.readFileSync(this.configPath));
		const path = ElectronService.normalizePath(this.config.pathToCrosscode);
		Globals.URL = 'file:///' + path;
		this.config.pathToCrosscode = path;
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
	
	public relaunch() {
		this.remote.app.relaunch();
		this.remote.app.exit();
	}
	
	public checkAssetsPath(path: string): boolean {
		try {
			const files = this.fs.readdirSync(path);
			return files.includes('data') && files.includes('media');
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	
	public getAssetsPath() {
		return this.config.pathToCrosscode;
	}
	
	public selectCcFolder(): string {
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialog({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		
		return newPath ? newPath[0] : undefined;
	}
	
	public saveAssetsPath(path: string) {
		this.config.pathToCrosscode = path;
		this.fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
	}
}
