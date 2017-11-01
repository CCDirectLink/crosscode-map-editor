import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import * as cors from 'cors';
import {config} from './config';

// Controllers (route handlers).
import * as apiController from './controllers/api';

const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.use(cors());
app.use(express.static(config.pathToCrosscode, {maxAge: 0}));
// app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Primary app routes.
 */
app.get('/api/allFiles', apiController.getAllFiles);


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

module.exports = app;
