import * as async from 'async';
import * as request from 'request';
import * as fs from 'fs';
import * as path from 'path';
import {Response, Request, NextFunction} from 'express';
import {config} from '../config';

export let getAllFiles = (req: Request, res: Response) => {
	res.json({
		images: listAllFiles(path.resolve(config.pathToCrosscode, 'media/'), [], 'png'),
		data: listAllFiles(path.resolve(config.pathToCrosscode, 'data/'), [], 'json')
	});
};

function listAllFiles(dir: string, filelist, ending: string): string[] {
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
			filelist = listAllFiles(path.resolve(dir, file), filelist, ending);
		} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
			const normalized = path.resolve(dir, file).split(path.normalize(config.pathToCrosscode))[1];
			filelist.push(normalized.split('\\').join('/'));
		}
	});
	return filelist;
}
