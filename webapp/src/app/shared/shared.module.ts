import {NgModule} from '@angular/core';
import {GlobalEventsService} from './global-events.service';
import {HostDirective} from './host.directive';
import {HttpClientService} from '../services/http-client.service';
import {MapLoaderService} from './map-loader.service';
import {MapSettingsComponent} from '../components/dialogs/map-settings/map-settings.component';
import {FloatingWindowComponent} from '../components/floating-window/floating-window.component';
import {JsonEditorComponent} from '../components/json-editor/json-editor.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {AngularDraggableModule} from 'angular2-draggable';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OffsetMapComponent} from '../components/dialogs/offset-map/offset-map.component';
import {ModalDirective} from './modal.directive';
import {KeepHtmlPipe} from './keep-html.pipe';

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
		ModalDirective,
		MapSettingsComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
		OffsetMapComponent,
		KeepHtmlPipe
	],
	providers: [
		HttpClientService,
		MapLoaderService,
		GlobalEventsService,
	],
	entryComponents: [
		JsonEditorComponent,
		MapSettingsComponent,
		OffsetMapComponent,
	],
	exports: [
		HostDirective,
		ModalDirective,
		MapSettingsComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
		KeepHtmlPipe
	]
})
export class SharedModule {
}
