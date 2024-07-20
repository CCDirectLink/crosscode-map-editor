import bodyParser from 'body-parser';
import { api } from 'cc-map-editor-common';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import logger from 'morgan';
import { config } from './config.js';

export const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env['PORT'] || 8080);
app.use(cors());
app.use(express.static(config.pathToCrosscode, { maxAge: 0 }));
// app.use(compression());
app.use(logger('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get('/api/allFiles', async (_, res) => res.json(await api.getAllFiles(config.pathToCrosscode)));
app.get('/api/allTilesets', async (_, res) => res.json(await api.getAllTilesets(config.pathToCrosscode)));
app.get('/api/allMaps', async (req, res) => res.json(await api.getAllMaps(config.pathToCrosscode, req.query['includeVanillaMaps'] == 'true')));
app.get('/api/allFilesInFolder', async (req, res) => res.json(await api.getAllFilesInFolder(config.pathToCrosscode, req.query['folder'] as string, req.query['extension'] as string)));
app.get('/api/allMods', async (_, res) => res.json(await api.getAllMods(config.pathToCrosscode)));
app.get('/api/allModMapEditorConfigs', async (_, res) => res.json(await api.getAllModMapEditorConfigs(config.pathToCrosscode)));
app.post('/api/get', async (req, res) => {
	res.json(await api.get(config.pathToCrosscode, req.body.path));
});
app.post('/api/resolve', async (req, res) => {
	try {
		res.json(await api.resolve(config.pathToCrosscode, req.body.path));
	} catch (err) {
		res.status(404).json(err);
	}
});
app.post('/api/select', async (req, res) => {
	await api.selectedMod(config.pathToCrosscode, req.body.mod);
	res.json({ success: true });
});
app.post('/api/saveFile', async (req, res) => {
	try {
		const msg = await api.saveFile(config.pathToCrosscode, req.body);
		res.status(200).json(msg);
	} catch (e) {
		console.error(e);
		res.status(400).json({ error: e });
	}
});

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
	console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
	console.log('  Press CTRL-C to stop\n');
});
