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
import {EventHelperService} from './event-widget/event-editor/event-helper.service';
import {EventDetailComponent} from './event-widget/event-editor/detail/event-detail.component';
import {EventAddComponent} from './event-widget/event-editor/add/event-add.component';
import {EventWindowComponent} from './event-widget/event-window/event-window.component';
import { CharacterWidgetComponent } from './character-widget/character-widget.component';
import { PersonWidgetComponent } from './person-widget/person-widget.component';

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
	CharacterWidgetComponent,
	PersonWidgetComponent
];

const PRIVATE_COMPONENTS = [
	EventRowComponent,
	EventWindowComponent,
	RowTextComponent,
	EventDetailComponent,
	EventAddComponent
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
		EventRegistryService,
		EventHelperService
	],
	declarations: [COMPONENTS, PRIVATE_COMPONENTS, CharacterWidgetComponent, PersonWidgetComponent,CharacterWidgetComponent],
	entryComponents: [COMPONENTS, PRIVATE_COMPONENTS],
	exports: COMPONENTS
})
export class WidgetModule {
}
