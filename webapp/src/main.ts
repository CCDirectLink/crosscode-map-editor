import { enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { AppModule } from './app/app.module';
import { Globals } from './app/services/globals';
import { environment } from './environments/environment';

import { BrowserService } from './app/services/browser.service';
import { ElectronService } from './app/services/electron.service';
import { platformBrowser } from '@angular/platform-browser';

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
	await platformBrowser().bootstrapModule(AppModule, {applicationProviders: [provideZoneChangeDetection()],});
})();
