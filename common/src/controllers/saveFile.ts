import {requireLocal} from '../require';

import * as nodefs from 'fs';
import * as nodepath from 'path';

const fs: typeof nodefs = requireLocal('fs');
const path: typeof nodepath = requireLocal('path');

export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	
	const fullPath = path.join(assetsPath, file.path);
	await fs.promises.writeFile(fullPath, file.content);
	return 'successfully saved file to "' + fullPath + '"';
}
