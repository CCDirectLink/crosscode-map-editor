import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Globals } from './app/services/globals';
import { environment } from './environments/environment';

import { BrowserService } from './app/services/browser.service';
import { ElectronService } from './app/services/electron.service';

if (environment.production) {
	enableProdMode();
}

if (
	typeof process !== 'undefined' &&
	typeof process.versions === 'object' &&
	!!process.versions.electron
) {
	Globals.isElectron = true;
}
console.log('is electron: ', Globals.isElectron);

(async () => {
	await ElectronService.init();
	await BrowserService.init();
	await platformBrowserDynamic().bootstrapModule(AppModule);
})().catch((err) => console.error(err));
