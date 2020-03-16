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
import {WidgetRegistryService} from './shared/widgets/widget-registry.service';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import {MaterialModule} from './external-modules/material.module';
import {HistoryModule} from './shared/history/history.module';
import {WidgetModule} from './shared/widgets/widget.module';
import {StateHistoryService} from './shared/history/state-history.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EditorComponent} from './components/editor/editor.component';
import {TileSelectorComponent} from './components/tile-selector/tile-selector.component';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {BabylonComponent} from './components/babylon/babylon.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

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
		TileSelectorComponent,
		BabylonComponent,
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
		ScrollingModule,
		MatProgressBarModule,
	],
	providers: [
		WidgetRegistryService,
		StateHistoryService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
