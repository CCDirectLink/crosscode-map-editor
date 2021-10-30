import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {Component, ElementRef, QueryList, ViewChild, ViewChildren, ChangeDetectorRef} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-language-label-widget',
	templateUrl: './language-label-widget.component.html',
	styleUrls: ['./language-label-widget.component.scss', '../widget.scss']
})
export class LanguageLabelWidgetComponent extends AbstractWidget {
	@ViewChildren(CdkTextareaAutosize) inputTextareas?: QueryList<CdkTextareaAutosize>;
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
	
	set hasValue(value: boolean) {
		if (value) {
			this.settings[this.key] = {
				...this.languages
			};
		} else {
			this.settings[this.key] = undefined;
		}
	}
}
