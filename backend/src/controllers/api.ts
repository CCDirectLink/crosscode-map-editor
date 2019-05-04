import * as fs from 'fs';
import * as path from 'path';
import {Response, Request, NextFunction} from 'express';
import {listAllFiles, config} from 'cc-map-editor-common';
export const getAllFiles = (req: Request, res: Response) => {
	res.json({
		images: listAllFiles(path.resolve(config.pathToCrosscode, 'media/'), [], 'png'),
		data: listAllFiles(path.resolve(config.pathToCrosscode, 'data/'), [], 'json')
	});
};

export const getAllTilesets = (req: Request, res: Response) => {
	res.json(listAllFiles(path.resolve(config.pathToCrosscode, 'media/map/'), [], 'png'));
};
