import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ResizedDirective } from '../../../directives/resized.directive';

@Component({
    selector: 'app-langlabel-widget',
    templateUrl: './langlabel-widget.component.html',
    styleUrls: ['./langlabel-widget.component.scss', '../widget.scss'],
    imports: [FlexModule, MatTooltip, MatCheckbox, FormsModule, ResizedDirective, CdkTextareaAutosize]
})
export class LangLabelWidgetComponent extends AbstractWidget {
	@ViewChildren(CdkTextareaAutosize) inputTextareas!: QueryList<CdkTextareaAutosize>;
	languages: string[] = [
		'en_US',
		'de_DE',
		'ja_JP',
		'ko_KR',
		'zh_CN',
		'zh_TW'
	];
	
	get hasValue(): boolean {
		return this.settings[this.key] !== undefined;
	}
	
	get defaultValue() {
		const value: any = {};
		for (const language of this.languages) {
			value[language] = '';
		}
		return value;
	}
	
	resizeTextareas() {
		this.inputTextareas.forEach(autosize => autosize.resizeToFitContent(true));
	}
}
