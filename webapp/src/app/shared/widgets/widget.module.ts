import {NgModule} from '@angular/core';
import {Vec2WidgetComponent} from './vec2-widget/vec2-widget.component';
import {JsonWidgetComponent} from './json-widget/json-widget.component';
import {BooleanWidgetComponent} from './boolean-widget/boolean-widget.component';
import {NumberWidgetComponent} from './number-widget/number-widget.component';
import {StringWidgetComponent} from './string-widget/string-widget.component';
import {MaterialModule} from '../../material.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LevelWidgetComponent} from './level-widget/level-widget.component';
import {NPCStatesWidgetComponent} from './npc-states-widget/npc-states-widget.component';
import {NpcStatesComponent} from './npc-states-widget/npc-states/npc-states.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {OverlayModule} from '@angular/cdk/overlay';
import {EventWidgetComponent} from './event-widget/event-widget.component';
import {EventRegistryService} from './event-widget/event-registry/event-registry.service';
import {SharedModule} from '../shared.module';
import {EventEditorComponent} from './event-widget/event-editor/editor/event-editor.component';
import {EventRowComponent} from './event-widget/event-editor/row/event-row.component';
import {RowTextComponent} from './event-widget/event-editor/row-text/row-text.component';

const COMPONENTS = [
	StringWidgetComponent,
	NumberWidgetComponent,
	BooleanWidgetComponent,
	JsonWidgetComponent,
	LevelWidgetComponent,
	Vec2WidgetComponent,
	NPCStatesWidgetComponent,
	NpcStatesComponent,
	EventWidgetComponent,
	EventEditorComponent,
];

const PRIVATE_COMPONENTS = [
	EventRowComponent,
	RowTextComponent,
];

@NgModule({
	imports: [
		FormsModule,
		FlexLayoutModule,
		CommonModule,
		MaterialModule,
		OverlayModule,
		AngularDraggableModule,
		SharedModule
	],
	providers: [
		EventRegistryService
	],
	declarations: [COMPONENTS, PRIVATE_COMPONENTS],
	entryComponents: COMPONENTS,
	exports: COMPONENTS
})
export class WidgetModule {
}
