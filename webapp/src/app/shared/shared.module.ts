import {NgModule} from '@angular/core';
import {GlobalEventsService} from './global-events.service';
import {HostDirective} from './host.directive';
import {HttpClientService} from '../services/http-client.service';
import {ElectronService} from '../services/electron.service';
import {MapLoaderService} from './map-loader.service';
import {MapSettingsComponent} from '../components/dialogs/map-settings/map-settings.component';
import {NewMapComponent} from '../components/dialogs/new-map/new-map.component';
import {FloatingWindowComponent} from '../components/floating-window/floating-window.component';
import {JsonEditorComponent} from '../components/json-editor/json-editor.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../external-modules/material.module';
import {AngularDraggableModule} from 'angular2-draggable';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OffsetMapComponent} from '../components/dialogs/offset-map/offset-map.component';
import {ModalDirective} from './modal.directive';
import {KeepHtmlPipe} from './keep-html.pipe';
import {SettingsComponent} from '../components/dialogs/settings/settings.component';
import {OverlayModule} from './overlay/overlay.module';

import {MapContentSettingsComponent} from '../components/dialogs/map-settings/map-content-settings/map-content-settings.component';
import {HighlightDirective} from './highlight.directive';
import {EntityRegistryService} from './phaser/entities/registry/entity-registry.service';
import {ListSearchOverlayComponent} from './list-search-overlay/list-search-overlay.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { BrowserService } from '../services/browser.service';
import { SplitPaneComponent } from './split-pane/split-pane.component';
import { SplitPaneModule } from './split-pane/split-pane.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		MaterialModule,
		AngularDraggableModule,
		OverlayModule,
		ScrollingModule,
		SplitPaneModule
	],
	declarations: [
		HostDirective,
		ModalDirective,
		MapSettingsComponent,
		MapContentSettingsComponent,
		NewMapComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
		OffsetMapComponent,
		KeepHtmlPipe,
		SettingsComponent,
		HighlightDirective,
		ListSearchOverlayComponent,
	],
	providers: [
		HttpClientService,
		ElectronService,
		BrowserService,
		MapLoaderService,
		GlobalEventsService,
		EntityRegistryService,
	],
	entryComponents: [
		JsonEditorComponent,
		MapSettingsComponent,
		MapContentSettingsComponent,
		NewMapComponent,
		OffsetMapComponent,
		SettingsComponent,
		ListSearchOverlayComponent,
	],
	exports: [
		HostDirective,
		ModalDirective,
		MapSettingsComponent,
		MapContentSettingsComponent,
		NewMapComponent,
		JsonEditorComponent,
		FloatingWindowComponent,
		OverlayModule,
		KeepHtmlPipe,
		SettingsComponent,
		HighlightDirective,
		SplitPaneComponent
	]
})
export class SharedModule {
}
