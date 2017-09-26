import * as async from 'async';
import * as request from 'request';
import * as fs from 'fs';
import {Response, Request, NextFunction} from 'express';
import {config} from '../config';


export let getAllFiles = (req: Request, res: Response) => {
	res.json({
		images: listAllFiles(config.pathToCrosscode + 'media/', [], 'png'),
		data: listAllFiles(config.pathToCrosscode + 'data/', [], 'json')
	});
};

function listAllFiles(dir: string, filelist, ending: string): string[] {
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = listAllFiles(dir + file + '/', filelist, ending);
		} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
			filelist.push((dir + file).split(config.pathToCrosscode)[1]);
		}
	});
	return filelist;
}
