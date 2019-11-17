import {Injectable} from '@angular/core';
import {Remote} from 'electron';
import * as nodeFs from 'fs';
import * as nodePath from 'path';
import * as nodeSemver from 'semver';
import {ElectronService} from './electron.service';
import {Globals} from '../shared/globals';
import {GlobalEventsService} from '../shared/global-events.service';
import {api} from 'cc-map-editor-common';
import {orderByDependencies} from './modloader-simulator-utils';

@Injectable({
  providedIn: 'root'
})
export class ModloaderSimulatorService {
	private readonly fs?: typeof nodeFs;
	private readonly path?: typeof nodePath;
	private readonly semver?: typeof nodeSemver;
	private mods: any[] = [];
 	constructor(
		 private electron: ElectronService
	 ) {
	  if (!Globals.isElectron) {
		  return;
	  }
	  // @ts-ignore
	  const remote = window.require('electron').remote;
	  this.fs = remote.require('fs');
	  this.path = remote.require('path');
	  this.semver = remote.require('semver');
	  this.init();
   }

   	private init() {
	   if (!this.semver) {
		   return false;
	   }
		// fetch mods and their package data
		const assetsPath = this.electron.getAssetsPath();
		const mods = api.getAllMods(assetsPath);
		const validMods = orderByDependencies(mods, this.semver);
		for (const mod of validMods) {
			if (this.hasAssetsPath(mod.path)) {
				this.mods.push(mod);
			}
		}
	}
	
	private hasAssetsPath(dir: string) {
		if (!this.fs) {
			return false;
		}

		try {
			return this.fs.readdirSync(dir).includes('assets');
		} catch (e) {}
		
		return false;
	}
	
	resolvePath(path: string) {
		if (!this.path) {
			return path;
		}
		const basePath = this.electron.getAssetsPath(false);
		let overridePath = this.path.join(basePath, path);
		for (const mod of this.mods) {
			if (this.modHasPath(mod, path)) {
				overridePath = this.path.normalize(this.resolveModPath(mod, path));
			}
		}
		return overridePath;
	}

	getPatchFiles(relativePath: string) {
		if (!this.fs || !this.path) {
			return [];
		}
		
		const patchRelativePath = relativePath + '.patch';
		const patches = [];
		for (const mod of this.mods) {
			if (this.modHasPath(mod, patchRelativePath)) {
				const patchPath = this.path.normalize(this.resolveModPath(mod, patchRelativePath));
				try {
					patches.push({
						mod,
						data: JSON.parse(this.fs.readFileSync(patchPath, 'utf8'))
					});
				} catch (e) {}
				
			}
		}
		return patches;
	}

	getRelativePath(path: string) {
		if (!this.path) {
			return path;
		}
		const basePath = this.path.normalize(this.electron.getAssetsPath(false));
		const fullPath = this.path.normalize(path);

		return fullPath.replace(basePath, '');
	}
	
	private resolveModPath(mod: any, relativePath: string) {
		if (!this.path) {
			return relativePath;
		}

		const fullPath = this.path.join(mod.path, 'assets/', relativePath);
		return fullPath;
	}
	
	private modHasPath(mod: any, relativePath: string) {
		if (!this.fs) {
			return false;
		}

		const fullPath = this.resolveModPath(mod, relativePath);

		return this.fs.existsSync(fullPath);
	}

}
