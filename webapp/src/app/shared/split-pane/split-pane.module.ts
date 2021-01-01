import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitPaneComponent } from './split-pane.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


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
