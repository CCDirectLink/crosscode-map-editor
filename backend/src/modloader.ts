import {GenericModLoader, Mod} from '@ac2pic/modloader';
import {config} from './config';
const CCModLoader: typeof GenericModLoader = require('@ac2pic/modloader');
const modloader = new CCModLoader;

modloader.setGamePath(config.pathToCrosscode);
modloader.loadMods();

export function getResourcePath(relativePath: string): string {
	return modloader.getResourcePath(relativePath);
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
