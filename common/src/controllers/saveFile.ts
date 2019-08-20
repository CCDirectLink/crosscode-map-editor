import {requireLocal} from '../require';

import * as nodefs from 'fs';
import * as nodepath from 'path';
import * as nodeutil from 'util';

const fs: typeof nodefs = requireLocal('fs');
const path: typeof nodepath = requireLocal('path');
const util: typeof nodeutil = requireLocal('util');


export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	const writeFile = util.promisify(fs.writeFile);
	
	const path = assetsPath + file.path;
	await writeFile(assetsPath + file.path, file.content);
	return 'successfully saved file to "' + assetsPath + file.path + '"';
}
