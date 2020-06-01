import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Globals} from './app/shared/globals';

import 'hammerjs';
import { ElectronService } from './app/services/electron.service';
import { BrowserService } from './app/services/browser.service';

if (environment.production) {
	enableProdMode();
}

// @ts-ignore
if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
	Globals.isElectron = true;
}
console.log('is electron: ', Globals.isElectron);

(async () => {
	await ElectronService.init();
	await BrowserService.init();
	platformBrowserDynamic().bootstrapModule(AppModule);
})();
