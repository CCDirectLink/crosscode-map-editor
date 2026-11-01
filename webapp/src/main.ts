import { enableProdMode, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';

import { AssetsAccessService } from './app/services/assets-access.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
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

(async () => {
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
			provideRouter(routes, withHashLocation()),
			provideZoneChangeDetection(),
			provideAppInitializer(() => inject(AssetsAccessService).init()),
			{
				provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
				useValue: tooltipOptions,
			},
		],
	});
})();
