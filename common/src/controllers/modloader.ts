import { requireLocal } from '../require';
import {GenericModLoader, Mod} from '@ac2pic/modloader';

import * as nodepath from 'path';
const path: typeof nodepath = requireLocal('path');


const CCModLoader: typeof GenericModLoader = requireLocal('@ac2pic/modloader');


let modloader: GenericModLoader;

export function changeAssetsPath(assetsPath: string): void {
    if (modloader === undefined) {
        modloader = new CCModLoader;
    } else {
        modloader.clearCache();
    }
    modloader.setGamePath(assetsPath);
    modloader.loadMods();
}

export function getResourcePath(relativePath: string, returnRelative: boolean = false): string {
	let resourcePath = modloader.getResourcePath(relativePath);

	if (returnRelative) {
		const foundPath = path.resolve(modloader.getResourcePath(relativePath));
		const basePath = path.resolve(modloader.getGamePath());
		const resourcePath = foundPath.replace(basePath, '');
		if (path.sep !== '/') {
			return resourcePath.replace(new RegExp(path.sep, "g"), '/');
		}
	}

	return resourcePath;
}

export function getMods(): Mod[] {
	return modloader.getMods();
}

export function loadJson(relativePath: string): Promise<string> {
	return modloader.loadJson(relativePath);
}

export function getAllModsAssetsPath(): any[] {
	const mods = modloader.getMods();
	const assetsMods = [];  
	for (const mod of mods) {
		if (mod.hasPath('data/maps')) {
			assetsMods.push({name: mod.name, path: mod.resolveRelativePath('assets/')});
		}
	}
	return assetsMods;
}