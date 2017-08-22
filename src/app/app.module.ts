import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {PhaserComponent} from './phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MdButtonModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule,
	MdProgressSpinnerModule, MdSelectModule,
	MdSidenavModule,
	MdSnackBarModule,
	MdToolbarModule, RippleGlobalOptions
} from '@angular/material';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MapLoaderService} from './shared/map-loader.service';
import {FormsModule} from '@angular/forms';
import {MapSettingsComponent} from './shared/dialogs/map-settings/map-settings.component';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		PhaserComponent,
		ToolbarComponent,
		SidenavComponent,
		MapSettingsComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		FlexLayoutModule,
		MdButtonModule,
		MdCheckboxModule,
		MdToolbarModule,
		MdSidenavModule,
		MdDialogModule,
		MdDialogModule,
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
	],
	providers: [
		MapLoaderService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
