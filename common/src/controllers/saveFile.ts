import {requireLocal} from '../require';

import * as nodefs from 'fs';

const fs: typeof nodefs = requireLocal('fs');

export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	
	const path = assetsPath + file.path;
	await fs.promises.writeFile(assetsPath + file.path, file.content);
	return 'successfully saved file to "' + path + '"';
}
