import { requireLocal } from '../require';

import * as nodefs from 'fs';
import * as nodepath from 'path';

const fs: typeof nodefs = requireLocal('fs');
const path: typeof nodepath = requireLocal('path');

export { saveFile } from './saveFile';

async function listAllFiles(dir: string, filelist: string[], ending: string, root?: string): Promise<string[]> {
	if (root === undefined) {
		root = dir;
	}

	const files = await fs.promises.readdir(dir);
	const promises: Promise<void>[] = [];
	for (const file of files) {
		promises.push(searchFile(file, dir, filelist, ending, root)); // CAUTION: Stores data in input variable (filelist)
	}
	await Promise.all(promises);
	return filelist;
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
			
		filelist.push(normalized.startsWith('/') ? normalized.substr(1) : normalized);
	}
}

export async function getAllFiles(dir: string) {
	return {
		images: await listAllFiles(path.resolve(dir, 'media/'), [], 'png', path.resolve(dir)),
		data: await listAllFiles(path.resolve(dir, 'data/'), [], 'json', path.resolve(dir))
	};
}

export async function getAllTilesets(dir: string) {
	return await listAllFiles(path.resolve(dir, 'media/map/'), [], 'png', path.resolve(dir));
}

export async function getAllMaps(dir: string) {
	return (await listAllFiles(path.resolve(dir, 'data/maps/'), [], 'json', path.resolve(dir)))
		.map(p => p.substring('data/maps/'.length, p.length - '.json'.length))
		.map(p => p.replace(/\//g, '.').replace(/\\/g, '.'));
}
