import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {Component, ElementRef, QueryList, ViewChild, ViewChildren, ChangeDetectorRef} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {ResizedEvent} from 'angular-resize-event';

@Component({
	selector: 'app-langlabel-widget',
	templateUrl: './langlabel-widget.component.html',
	styleUrls: ['./langlabel-widget.component.scss', '../widget.scss']
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
	
	constructor() {
		super();
	}
	
	get hasValue(): boolean {
		return this.settings[this.key] !== undefined;
	}
	
	get defaultValue() {
		const value = Object.create(null);
		for (const language of this.languages) {
			value[language] = '';
		}
		return value;
	}
	
	resizeTextareas() {
		this.inputTextareas.forEach(autosize => autosize.resizeToFitContent(true));
	}
}
