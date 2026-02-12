import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';


import { Globals } from './app/services/globals';
import { environment } from './environments/environment';

import { BrowserService } from './app/services/browser.service';
import { ElectronService } from './app/services/electron.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppComponent } from './app/app.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

const tooltipOptions: Partial<MatTooltipDefaultOptions> = {
	disableTooltipInteractivity: true,
};

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
	await bootstrapApplication(AppComponent, {
		providers: [
			importProvidersFrom(
				BrowserModule,
				DragDropModule,
				FormsModule,
				FlexLayoutModule,
				BrowserAnimationsModule,
				ScrollingModule,
				ReactiveFormsModule,
				OverlayModule,
			),
			provideHttpClient(withInterceptorsFromDi()),
			provideRouter(routes),
			provideZoneChangeDetection(),
			{
				provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
				useValue: tooltipOptions,
			},
		]
	});
})();
