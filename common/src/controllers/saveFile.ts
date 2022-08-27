import {requireLocal} from '../require';

const fs: typeof import('fs') = requireLocal('fs');
const path: typeof import('path') = requireLocal('path');

export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	
	const fullPath = path.join(assetsPath, file.path);
	fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
	await fs.promises.writeFile(fullPath, file.content);
	return 'successfully saved file to "' + fullPath + '"';
}
