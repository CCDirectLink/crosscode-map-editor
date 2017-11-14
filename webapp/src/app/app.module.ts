import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {PhaserComponent} from './phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './sidenav/sidenav.component';
import {FormsModule} from '@angular/forms';
import {LayersComponent} from './sidenav/layers/layers.component';
import {EntitiesComponent} from './sidenav/entities/entities.component';
import {WidgetRegistryService} from './sidenav/entities/widgets/widget-registry.service';
import {AddEntityMenuComponent} from './editor/add-entity-menu/add-entity-menu.component';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import {MaterialModule} from './material.module';
import {HistoryModule} from './history/history.module';
import {WidgetModule} from './sidenav/entities/widgets/widget.module';
import {StateHistoryService} from './history/state-history.service';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		PhaserComponent,
		ToolbarComponent,
		SidenavComponent,
		LayersComponent,
		EntitiesComponent,
		AddEntityMenuComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
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
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
