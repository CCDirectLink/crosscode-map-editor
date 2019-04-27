import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PhaserComponent} from './components/phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {FormsModule} from '@angular/forms';
import {LayersComponent} from './components/layers/layers.component';
import {EntitiesComponent} from './components/entities/entities.component';
import {WidgetRegistryService} from './shared/widgets/widget-registry.service';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import {MaterialModule} from './material.module';
import {HistoryModule} from './shared/history/history.module';
import {WidgetModule} from './shared/widgets/widget.module';
import {StateHistoryService} from './shared/history/state-history.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EditorComponent} from './components/editor/editor.component';
import {AddEntityMenuComponent} from './components/editor/add-entity-menu/add-entity-menu.component';


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
		DragDropModule,
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
