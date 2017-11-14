import {NgModule} from '@angular/core';
import {HistoryComponent} from './history.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../material.module';

@NgModule({
	imports: [
		FormsModule,
		FlexLayoutModule,
		CommonModule,
		MaterialModule,
		SharedModule
	],
	declarations: [
		HistoryComponent
	],
	exports: [
		HistoryComponent
	]
})
export class HistoryModule {
}
