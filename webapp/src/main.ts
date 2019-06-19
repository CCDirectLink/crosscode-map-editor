import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Globals} from './app/shared/globals';

import 'hammerjs';

if (environment.production) {
	enableProdMode();
}

// @ts-ignore
if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
	Globals.isElectron = true;
}
console.log('is electron: ', Globals.isElectron);

platformBrowserDynamic().bootstrapModule(AppModule);
