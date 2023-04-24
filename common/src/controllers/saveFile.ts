import { fsPromise, pathPromise } from '../require.js';

export async function saveFile(assetsPath: string, file: { content: string, path: string }) {
	const fs = await fsPromise;
	const path = await pathPromise;
	
	const fullPath = path.join(assetsPath, file.path);
	fs.promises.mkdir(path.dirname(fullPath), {recursive: true});
	await fs.promises.writeFile(fullPath, file.content);
	return 'successfully saved file to "' + fullPath + '"';
}
