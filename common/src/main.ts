import * as Api from './controllers/api';
import * as Config from './config';


export let listAllFiles = (dir: string, filelist: any, ending: string): string[]  => {
	return Api.listAllFiles(dir, filelist, ending);
};
export let config = Config.config;