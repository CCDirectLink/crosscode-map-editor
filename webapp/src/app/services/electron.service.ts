import {Injectable} from '@angular/core';
import {Globals} from '../shared/globals';
import {Dialog, Remote} from 'electron';
import * as nodeFs from 'fs';
import { api } from 'cc-map-editor-common';
import { SharedService } from './sharedService';

@Injectable()
export class ElectronService implements SharedService {
	private static readonly storageName = 'assetsPath';
	private static readonly modName = 'selectedMod';
	private static readonly wrapLinesName = 'wrapEventEditorLines';
	private static assetsPath = '';
	private static selectedMod = '';
	private static wrapEventEditorLines = true;
	
	private readonly fs?: typeof nodeFs;
	private readonly remote?: Remote;
	
	constructor() {
		if (!Globals.isElectron) {
			return;
		}
		
		// @ts-ignore
		const remote = window.require('electron').remote;
		this.remote = remote!;
		this.fs = remote.require('fs');
		
	}

	public static async init() {
		if (!Globals.isElectron) {
			return;
		}

		ElectronService.assetsPath = localStorage.getItem(ElectronService.storageName) || '';
		ElectronService.updateURL();
		ElectronService.selectedMod = localStorage.getItem(this.modName) || '';
		await ElectronService.updateMod();
		ElectronService.wrapEventEditorLines = (localStorage.getItem(this.wrapName) === 'true') || ElectronService.wrapEventEditorLines;
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
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialogSync({
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
	
		localStorage.setItem (ElectronService.wrapName, wrap? 'true' : 'false');
		ElectronService.wrapEventEditorLines = wrap;
	public saveWrapEventEditorLinesSetting(wrap: boolean) {
	}
	
	public getAssetsPath() {
		return ElectronService.assetsPath;
	}

	public getSelectedMod() {
		return ElectronService.selectedMod;
	}
	
		return localStorage.getItem (ElectronService.wrapName) === 'true';
	public getWrapEventEditorLinesSetting() {
	}
}
