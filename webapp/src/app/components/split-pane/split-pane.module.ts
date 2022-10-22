import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SplitPaneComponent } from './split-pane.component';


@NgModule({
	declarations: [
		SplitPaneComponent
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule
	],
	exports: [
		SplitPaneComponent
	]
})
export class SplitPaneModule {
}
