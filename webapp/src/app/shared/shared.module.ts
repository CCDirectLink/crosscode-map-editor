import {NgModule} from '@angular/core';
import {GlobalEventsService} from './global-events.service';
import {HostDirective} from './host.directive';
import {HttpClientService} from './http-client.service';
import {MapLoaderService} from './map-loader.service';
import {MapSettingsComponent} from './dialogs/map-settings/map-settings.component';
import {FloatingWindowComponent} from './floating-window/floating-window.component';
import {JsonEditorComponent} from './json-editor/json-editor.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {AngularDraggableModule} from 'angular2-draggable';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
	imports: [
		FormsModule,
		FlexLayoutModule,
		CommonModule,
		MaterialModule,
		AngularDraggableModule,
	],
	declarations: [
		HostDirective,
		MapSettingsComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
	],
	providers: [
		HttpClientService,
		MapLoaderService,
		GlobalEventsService,
	],
	entryComponents: [
		JsonEditorComponent,
		MapSettingsComponent
	],
	exports: [
		HostDirective,
		MapSettingsComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
	]
})
export class SharedModule {
}
