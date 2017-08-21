import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {PhaserComponent} from './phaser/phaser.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MD_RIPPLE_GLOBAL_OPTIONS,
	MdButtonModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdListModule, MdProgressSpinnerModule,
	MdSidenavModule,
	MdSnackBarModule,
	MdToolbarModule, RippleGlobalOptions
} from '@angular/material';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MapLoaderService} from './shared/map-loader.service';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		PhaserComponent,
		ToolbarComponent,
		SidenavComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		MdButtonModule,
		MdCheckboxModule,
		MdToolbarModule,
		MdSidenavModule,
		MdDialogModule,
		MdSnackBarModule,
		MdProgressSpinnerModule,
		MdListModule,
		MdIconModule,
		BrowserAnimationsModule
	],
	providers: [
		MapLoaderService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
