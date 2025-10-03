import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-langlabel-widget',
	templateUrl: './langlabel-widget.component.html',
	styleUrls: ['./langlabel-widget.component.scss', '../widget.scss'],
	standalone: false,
})
export class LangLabelWidgetComponent extends AbstractWidget {
	@ViewChildren(CdkTextareaAutosize)
	inputTextareas!: QueryList<CdkTextareaAutosize>;
	languages: string[] = [
		'en_US',
		'de_DE',
		'ja_JP',
		'ko_KR',
		'zh_CN',
		'zh_TW',
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
		this.inputTextareas.forEach((autosize) =>
			autosize.resizeToFitContent(true),
		);
	}
}
