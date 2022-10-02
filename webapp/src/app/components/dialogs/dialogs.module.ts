import {NgModule} from '@angular/core';

import {MapSettingsComponent} from './map-settings/map-settings.component';
import {NewMapComponent} from './new-map/new-map.component';
import {MapContentSettingsComponent} from './map-settings/map-content-settings/map-content-settings.component';
import {OffsetMapComponent} from './offset-map/offset-map.component';
import {SettingsComponent} from './settings/settings.component';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularDraggableModule} from 'angular2-draggable';
import {WidgetModule} from '../../shared/widgets/widget.module';
import {OverlayModule} from '../../shared/overlay/overlay.module';
import {MaterialModule} from '../../external-modules/material.module';
import {SplitPaneModule} from '../../shared/split-pane/split-pane.module';

@NgModule({
	declarations: [
		MapSettingsComponent,
		NewMapComponent,
		MapContentSettingsComponent,
		OffsetMapComponent,
		SettingsComponent,
	],
	exports: [
		MapSettingsComponent,
		NewMapComponent,
		OffsetMapComponent,
		SettingsComponent,
	],
	imports: [
		WidgetModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		MaterialModule,
		AngularDraggableModule,
		OverlayModule,
		ScrollingModule,
		SplitPaneModule,
	],
})
export class DialogsModule {
}
