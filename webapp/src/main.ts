import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Globals} from './app/shared/globals';

if (environment.production) {
	enableProdMode();
}

try {
	if (requireNode) {
		Globals.isNwjs = typeof requireNode('nw.gui') !== 'undefined';
	} else {
		Globals.isNwjs = false;
	}
} catch (e) {
	Globals.isNwjs = false;
}
console.log('is nwjs: ', Globals.isNwjs);


platformBrowserDynamic().bootstrapModule(AppModule);
