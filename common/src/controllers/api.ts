import { requireLocal } from '../require';

import * as nodefs from 'fs';
import * as nodepath from 'path';

const fs: typeof nodefs = requireLocal('fs');
const path: typeof nodepath = requireLocal('path');

function listAllFiles(dir: string, filelist: string[], ending: string, root?: string): string[] {
	if (root === undefined) {
		root = dir;
	}

	const files = fs.readdirSync(dir);
	for (const file of files) {
		if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
			filelist = listAllFiles(path.resolve(dir, file), filelist, ending, root);
		} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
			const normalized = path
				.resolve(dir, file)
				.split(path.normalize(root))[1]
				.replace(/\\/g, '/');
				
			filelist.push(normalized.startsWith('/') ? normalized.substr(1) : normalized);
		}
	}
	return filelist;
}

export function getAllFiles(dir: string) {
	return {
		images: listAllFiles(path.resolve(dir, 'media/'), [], 'png', path.resolve(dir)),
		data: listAllFiles(path.resolve(dir, 'data/'), [], 'json', path.resolve(dir))
	};
}

export function getAllTilesets(dir: string) {
	return listAllFiles(path.resolve(dir, 'media/map/'), [], 'png', path.resolve(dir));
}
