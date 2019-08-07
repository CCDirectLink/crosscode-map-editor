import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {routes} from './app-routing';
import {AppComponent} from './app.component';
import {PhaserComponent} from './components/phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {FormsModule} from '@angular/forms';
import {LayersComponent} from './components/layers/layers.component';
import {EntitiesComponent} from './components/entities/entities.component';
import {LoadMapComponent} from './components/load-map/load-map.component';
import {WidgetRegistryService} from './renderer/widgets/widget-registry.service';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './renderer/shared.module';
import {MaterialModule} from './external-modules/material.module';
import {HistoryModule} from './history/history.module';
import {WidgetModule} from './renderer/widgets/widget.module';
import {StateHistoryService} from './history/state-history.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EditorComponent} from './components/editor/editor.component';
import {AddEntityMenuComponent} from './components/editor/add-entity-menu/add-entity-menu.component';
import { TileSelectorComponent } from './components/tile-selector/tile-selector.component';
import {RouterModule} from '@angular/router';
import { HttpService } from './services/http.service';
import { CommonService } from './services/common.service';
import { LoaderService } from './services/loader.service';
import { EventService } from './services/event.service';
import { SettingsService } from './services/settings.service';
import { ElectronService } from './services/electron.service';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		PhaserComponent,
		ToolbarComponent,
		SidenavComponent,
		LayersComponent,
		EntitiesComponent,
		LoadMapComponent,
		AddEntityMenuComponent,
		TileSelectorComponent
	],
	imports: [
		RouterModule.forRoot(routes),
		BrowserModule,
		DragDropModule,
		FormsModule,
		FlexLayoutModule,
		MaterialModule,
		HttpClientModule,
		BrowserAnimationsModule,
		WidgetModule,
		SharedModule,
		HistoryModule,
	],
	providers: [
		WidgetRegistryService,
		StateHistoryService,
		HttpService,
		CommonService,
		LoaderService,
		EventService,
		SettingsService,
		ElectronService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
