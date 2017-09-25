import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {PhaserComponent} from './phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MdButtonModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule,
	MdProgressSpinnerModule, MdSelectModule,
	MdSidenavModule,
	MdSnackBarModule, MdTabsModule,
	MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MapLoaderService} from './shared/map-loader.service';
import {FormsModule} from '@angular/forms';
import {MapSettingsComponent} from './shared/dialogs/map-settings/map-settings.component';
import {LayersComponent} from './sidenav/layers/layers.component';
import {EntitiesComponent} from './sidenav/entities/entities.component';
import {GlobalEventsService} from './shared/global-events.service';
import {StringWidgetComponent} from './sidenav/entities/widgets/string-widget/string-widget.component';
import {HostDirective} from './shared/host.directive';
import {WidgetRegistryService} from './sidenav/entities/widgets/widget-registry.service';
import { JsonWidgetComponent } from './sidenav/entities/widgets/json-widget/json-widget.component';
import {NumberWidgetComponent} from './sidenav/entities/widgets/number-widget/number-widget.component';
import { BooleanWidgetComponent } from './sidenav/entities/widgets/boolean-widget/boolean-widget.component';
import { Vec2WidgetComponent } from './sidenav/entities/widgets/vec2-widget/vec2-widget.component';
import { AddEntityMenuComponent } from './editor/add-entity-menu/add-entity-menu.component';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		PhaserComponent,
		ToolbarComponent,
		SidenavComponent,
		MapSettingsComponent,
		LayersComponent,
		EntitiesComponent,
		StringWidgetComponent,
		NumberWidgetComponent,
		HostDirective,
		JsonWidgetComponent,
		BooleanWidgetComponent,
		Vec2WidgetComponent,
		AddEntityMenuComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		FlexLayoutModule,
		MdButtonModule,
		MdTooltipModule,
		MdCheckboxModule,
		MdToolbarModule,
		MdMenuModule,
		MdSidenavModule,
		MdDialogModule,
		MdDialogModule,
		MdTabsModule,
		MdInputModule,
		MdSelectModule,
		MdSnackBarModule,
		MdProgressSpinnerModule,
		MdListModule,
		MdIconModule,
		BrowserAnimationsModule
	],
	entryComponents: [
		MapSettingsComponent,
		StringWidgetComponent,
		NumberWidgetComponent,
		BooleanWidgetComponent,
		JsonWidgetComponent,
		Vec2WidgetComponent,
	],
	providers: [
		MapLoaderService,
		GlobalEventsService,
		WidgetRegistryService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
