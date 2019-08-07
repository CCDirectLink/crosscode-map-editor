import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import 'hammerjs';

if (environment.production) {
	enableProdMode();
}

let isElectron = false;
if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
	isElectron = true;
}
console.log('is electron: ', isElectron);

platformBrowserDynamic().bootstrapModule(AppModule);
