import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	OverlayPanelComponent,
} from './overlay-panel/overlay-panel.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularDraggableModule} from 'angular2-draggable';
import {MaterialModule} from '../external-modules/material.module';

const EXPORTS = [
	OverlayPanelComponent,
];

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		AngularDraggableModule,
		MaterialModule,
	],
	declarations: EXPORTS,
	exports: EXPORTS
})
export class OverlayModule {
}
