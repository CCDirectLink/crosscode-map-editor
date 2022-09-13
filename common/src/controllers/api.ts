import { requireLocal } from '../require';

const fs: typeof import('fs') = requireLocal('fs');
const path: typeof import('path') = requireLocal('path');

import { saveFile as save } from './saveFile';

const mods: string[] = [];
let packagesCache: Map<string, {folderName: string, ccmodDependencies?: Map<string, string>}>;

async function listAllFiles(dir: string, filelist: string[], ending: string, root?: string): Promise<string[]> {
	if (root === undefined) {
		root = dir;
	}

	const files = await tryReadDir(dir);
	const promises: Promise<void>[] = [];
	for (const file of files) {
		promises.push(searchFile(file, dir, filelist, ending, root)); // CAUTION: Stores data in input variable (filelist)
	}
	await Promise.all(promises);
	return filelist;
}

async function tryReadDir(dir: string): Promise<string[]> {
	try {
		return await fs.promises.readdir(dir);
	} catch {
		return [];
	}
}

/**
 * Searches a file or directory in the given base directory for the specified files and stores it in filelist.
 * CAUTION: Stores data in input variable (filelist)
 *
 * @param file 		File or directory to inspect
 * @param dir 		Parent directory of the file
 * @param filelist 	The list of found files
 * @param ending 	The ending of the target files
 * @param root 		The root folder
 */
async function searchFile(file: string, dir: string, filelist: string[], ending: string, root?: string): Promise<void> {
	const stat = await fs.promises.stat(path.resolve(dir, file));
	if (stat.isDirectory()) {
		await listAllFiles(path.resolve(dir, file), filelist, ending, root);
	} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
		const normalized = path
			.resolve(dir, file)
			.split(path.normalize(root))[1]
			.replace(/\\/g, '/');
		
		const result = normalized.startsWith('/') ? normalized.substr(1) : normalized;
		if (!filelist.includes(result)) {
			filelist.push(result);
		}
	}
}

/**
 * Searches the folders of a single folder for a file. This fuction is NOT recursive.
 * @param dir 	The top directory to be searched
 * @param file 	The file to be searched
 */
async function searchSubFolder(dir: string, file: string): Promise<string[]> {
	const result: string[] = [];
	const files = await tryReadDir(dir);
	for (const folder of files) {
		try {
			const stat = await fs.promises.stat(path.join(dir, folder, file));
			if (stat.isFile()) {
				result.push(path.join(dir, folder, file));
			}
		} catch (e) {
			console.error(e);
		}
	}
	return result;
}

function selectMod(name: string, packages: Map<string, {folderName: string, ccmodDependencies?: Map<string, string>}>, result: string[]) {
	const pkg = packages.get(name);
	if (!pkg) {
		return;
	}

	result.push(pkg.folderName);
	if (!pkg.ccmodDependencies) {
		return;
	}

	for (const depName of Object.keys(pkg.ccmodDependencies)) {
		selectMod(depName, packages, result);
	}
}

async function getAsync(file: string): Promise<Buffer | null> {
	try {
		const stat = await fs.promises.stat(file);
		if (stat.isFile()) {
			return fs.promises.readFile(file);
		}
	} catch (e) {
		console.error(e);
	}
	return null;
}

async function resolveAsync(file: string): Promise<string | null> {
	try {
		const stat = await fs.promises.stat(file);
		if (stat.isFile()) {
			return file;
		}
	} catch (e) {
		console.error(e);
	}
	return null;
}

async function readMods(dir: string) {
	if (packagesCache) {
		return packagesCache;
	}

	const modFolder = path.join(dir, 'mods/');
	const files = await searchSubFolder(modFolder, 'package.json');
	const promises: Promise<[string, Buffer]>[] = [];
	for (const file of files) {
		promises.push((async(): Promise<[string, Buffer]> => [path.basename(path.dirname(file)), await fs.promises.readFile(file)])());
	}
	const rawPackages = await Promise.all(promises);
	const packages = new Map<string, {folderName: string, ccmodDependencies?: Map<string, string>}>();

	for (const [name, pkg] of rawPackages) {
		const parsed = JSON.parse(pkg as unknown as string);
		parsed.folderName = name;
		packages.set(parsed.name, parsed);
	}

	packagesCache = packages;
	return packages;
}

export async function getAllFiles(dir: string) {
	const images = await listAllFiles(path.resolve(dir, 'media/'), [], 'png', path.resolve(dir));
	const data = await listAllFiles(path.resolve(dir, 'data/'), [], 'json', path.resolve(dir));

	for (const mod of mods) {
		const modDir = path.join(dir, 'mods', mod, 'assets');
		await listAllFiles(path.resolve(modDir, 'media/'), images, 'png', path.resolve(modDir));
		await listAllFiles(path.resolve(modDir, 'data/'), data, 'json', path.resolve(modDir));
	}

	images.sort();
	data.sort();

	return {images,	data};
}

export async function getAllTilesets(dir: string) {
	const result = await listAllFiles(path.resolve(dir, 'media/map/'), [], 'png', path.resolve(dir));

	for (const mod of mods) {
		const modDir = path.join(dir, 'mods', mod, 'assets');
		await listAllFiles(path.resolve(modDir, 'media/map/'), result, 'png', path.resolve(modDir));
	}

	return result.sort();
}

export async function getAllMaps(dir: string) {
	const paths: string[] = [];
	if (mods.length === 0) {
		await listAllFiles(path.resolve(dir, 'data/maps/'), paths, 'json', path.resolve(dir));
	} else {
		const modDir = path.join(dir, 'mods', mods[0], 'assets');
		await listAllFiles(path.resolve(modDir, 'data/maps/'), paths, 'json', path.resolve(modDir));
	}

	return paths
		.sort()
		.map(p => p.substring('data/maps/'.length, p.length - '.json'.length))
		.map(p => p.replace(/\//g, '.').replace(/\\/g, '.'));
}

export async function getAllMods(dir: string) {
	const packages = await readMods(dir);
	return Array.from(packages.keys()).sort();
}

export async function selectedMod(dir: string, modName: string) {
	const packages = await readMods(dir);
	mods.splice(0); // Clear array
	selectMod(modName, packages, mods);
}

export async function get<T>(dir: string, file: string): Promise<T> {
	const promises: Promise<Buffer>[] = [];
	for (const mod of mods) {
		const modFile = path.join(dir, 'mods', mod, 'assets', file);
		promises.push(getAsync(modFile));
	}
	promises.push(getAsync(path.join(dir, file)));

	const results = await Promise.all(promises);
	for (const result of results) {
		if (result) {
			return JSON.parse(result as unknown as string);
		}
	}
	throw new Error('File not found: ' + file);
}

export async function resolve(dir: string, file: string): Promise<string> {
	const promises: Promise<string>[] = [];
	for (const mod of mods) {
		const modFile = path.join(dir, 'mods', mod, 'assets', file);
		promises.push(resolveAsync(modFile));
	}
	promises.push(resolveAsync(path.join(dir, file)));

	const results = await Promise.all(promises);
	for (const result of results) {
		if (result) {
			return path.relative(dir, result);
		}
	}
	throw new Error('File not found: ' + file);
}

export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	if (mods.length === 0) {
		return save(assetsPath, file);
	} else {
		return save(path.join(assetsPath, 'mods', mods[0], 'assets'), file);
	}
}
