import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing';
import { AppComponent } from './app.component';
import { BabylonComponent } from './components/babylon/babylon.component';
import { CaptionsComponent } from './components/captions/captions.component';
import { ConfirmCloseComponent } from './components/dialogs/confirm-close/confirm-close.component';
import { FloatingWindowComponent } from './components/dialogs/floating-window/floating-window.component';
import { HistoryComponent } from './components/dialogs/floating-window/history/history.component';
import { TileSelectorComponent } from './components/dialogs/floating-window/tile-selector/tile-selector.component';
import { ListSearchOverlayComponent } from './components/dialogs/list-search-overlay/list-search-overlay.component';
import { LoadMapComponent } from './components/dialogs/load-map/load-map.component';
import { MapContentSettingsComponent } from './components/dialogs/map-settings/map-content-settings/map-content-settings.component';
import { MapSettingsComponent } from './components/dialogs/map-settings/map-settings.component';
import { NewMapComponent } from './components/dialogs/new-map/new-map.component';
import { OffsetMapComponent } from './components/dialogs/offset-map/offset-map.component';
import { OverlayPanelComponent } from './components/dialogs/overlay/overlay-panel/overlay-panel.component';
import { SettingsComponent } from './components/dialogs/settings/settings.component';
import { EditorComponent } from './components/editor/editor.component';
import { EntitiesComponent } from './components/entities/entities.component';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { LayersComponent } from './components/layers/layers.component';
import { PhaserComponent } from './components/phaser/phaser.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SplitPaneComponent } from './components/split-pane/split-pane.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BooleanWidgetComponent } from './components/widgets/boolean-widget/boolean-widget.component';
import { CharacterWidgetComponent } from './components/widgets/character-widget/character-widget.component';
import { CustomDesTypeWidgetComponent } from './components/widgets/custom-des-type-widget/custom-des-type-widget.component';
import { EnemySingleTypeWidgetComponent } from './components/widgets/enemy-single-type-widget/enemy-single-type-widget.component';
import { EnemyTypeWidgetOverlayComponent } from './components/widgets/enemy-type-widget/enemy-type-overlay/enemy-type-overlay.component';
import { EnemyTypeWidgetComponent } from './components/widgets/enemy-type-widget/enemy-type-widget.component';
import { EventDetailComponent } from './components/widgets/event-widget/event-editor/detail/event-detail.component';
import { EventEditorComponent } from './components/widgets/event-widget/event-editor/editor/event-editor.component';
import { RowTextComponent } from './components/widgets/event-widget/event-editor/row-text/row-text.component';
import { EventWidgetComponent } from './components/widgets/event-widget/event-widget.component';
import { EventWindowComponent } from './components/widgets/event-widget/event-window/event-window.component';
import { InputWithButtonComponent } from './components/widgets/inputs/input-with-button/input-with-button.component';
import { JsonWidgetComponent } from './components/widgets/json-widget/json-widget.component';
import { LangLabelWidgetComponent } from './components/widgets/langlabel-widget/langlabel-widget.component';
import { LevelWidgetComponent } from './components/widgets/level-widget/level-widget.component';
import { NPCStatesWidgetComponent } from './components/widgets/npc-states-widget/npc-states-widget.component';
import { NpcStatesComponent } from './components/widgets/npc-states-widget/npc-states/npc-states.component';
import { NumberWidgetComponent } from './components/widgets/number-widget/number-widget.component';
import { CustomExpressionWidgetComponent } from './components/widgets/person-expression-widget/custom-expression-widget/custom-expression-widget.component';
import { PersonExpressionWidgetComponent } from './components/widgets/person-expression-widget/person-expression-widget.component';
import { PropTypeWidgetComponent } from './components/widgets/prop-type-widget/prop-type-widget.component';
import { ScalablePropConfigWidgetComponent } from './components/widgets/scalable-prop-config-widget/scalable-prop-config-widget.component';
import { ImageSelectCardComponent } from './components/widgets/shared/image-select-overlay/image-select-card/image-select-card.component';
import { ImageSelectListComponent } from './components/widgets/shared/image-select-overlay/image-select-list/image-select-list.component';
import { ImageSelectOverlayComponent } from './components/widgets/shared/image-select-overlay/image-select-overlay.component';
import { AutocompletedTextboxComponent } from './components/widgets/string-widget/autocompleted-textbox/autocompleted-textbox.component';
import { StringWidgetComponent } from './components/widgets/string-widget/string-widget.component';
import { Vec2WidgetComponent } from './components/widgets/vec2-widget/vec2-widget.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { HostDirective } from './directives/host.directive';
import { ModalDirective } from './directives/modal.directive';
import { ResizedDirective } from './directives/resized.directive';
import { MaterialModule } from './external-modules/material.module';
import { CombinedTooltipPipe } from './pipes/combined-tooltip.pipe';
import { KeepHtmlPipe } from './pipes/keep-html.pipe';

const WIDGETS = [
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
	PersonExpressionWidgetComponent,
	EnemyTypeWidgetComponent,
	PropTypeWidgetComponent,
	LangLabelWidgetComponent,
	AutocompletedTextboxComponent,
	ScalablePropConfigWidgetComponent,
	EnemySingleTypeWidgetComponent,
	CustomDesTypeWidgetComponent,
	CustomExpressionWidgetComponent,
	CharacterWidgetComponent,
];

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
		SplitPaneComponent,
		BabylonComponent,
		CaptionsComponent,
		MapSettingsComponent,
		NewMapComponent,
		MapContentSettingsComponent,
		OffsetMapComponent,
		SettingsComponent,
		HistoryComponent,
		OverlayPanelComponent,
		HostDirective,
		ModalDirective,
		JsonEditorComponent,
		FloatingWindowComponent,
		KeepHtmlPipe,
		ListSearchOverlayComponent,
		EventWindowComponent,
		RowTextComponent,
		EventDetailComponent,
		EnemyTypeWidgetOverlayComponent,
		ImageSelectOverlayComponent,
		ConfirmCloseComponent,
		ResizedDirective,
		...WIDGETS,
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
		ScrollingModule,
		ReactiveFormsModule,
		OverlayModule,
		ImageSelectCardComponent,
		ImageSelectListComponent,
		HighlightDirective,
		AutofocusDirective,
		CombinedTooltipPipe,
		InputWithButtonComponent,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
