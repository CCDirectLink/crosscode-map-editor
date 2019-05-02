import { config } from '../config';
import { requireLocal } from '../require';

const fs = requireLocal('fs');
const path = requireLocal('path');

export function listAllFiles(dir: string, filelist, ending: string): string[] {
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
			filelist = listAllFiles(path.resolve(dir, file), filelist, ending);
		} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
			let normalized = path.resolve(dir, file).split(path.normalize(config.pathToCrosscode))[1];
			normalized = normalized.split('\\').join('/');
			if (normalized.startsWith('/')) {
				normalized = normalized.substr(1);
			}
			filelist.push(normalized);
		}
	});
	return filelist;
}
