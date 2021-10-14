import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {Component, OnInit, DoCheck, ElementRef, QueryList, ViewChild, ViewChildren, ChangeDetectorRef} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-language-label-widget',
	templateUrl: './language-label-widget.component.html',
	styleUrls: ['./language-label-widget.component.scss', '../widget.scss']
})
export class LanguageLabelWidgetComponent extends AbstractWidget implements OnInit, DoCheck {
	@ViewChildren(CdkTextareaAutosize) inputTextareas?: QueryList<CdkTextareaAutosize>;
	@ViewChild('rootDiv', {static: true}) rootDiv!: ElementRef<HTMLDivElement>;
	languages: string[] = [
		'en_US',
		'de_DE',
		'ja_JP',
		'ko_KR',
		'zh_CN',
		'zh_TW'
	];
	keys: string[] = [];
	previousWidth = 0;
	
	constructor(private readonly element: ElementRef, private readonly changeDetector: ChangeDetectorRef) {
		super();
	}
	
	ngOnInit() {
		//Idk, copied from string widget
		super.ngOnInit();
		const attr = this.attribute;
		if (attr && attr.options) {
			this.keys = Object.keys(attr.options);
			if (attr.withNull) {
				this.keys.unshift('');
			}
		}
		
		//Workaround for height not properly adjusting when opening detail panel
		//This seems to happen because the widget is created with minimum width and
		//and its height is determined then, but when expanded its height does not get adjusted.
		//So as a workaround 500ms from when the panel is opened we force a size update of the widget.
		/*setTimeout (() => {
			this.inputTextareas.forEach ((inputTextarea) => {
				// eslint-disable-next-line no-self-assign
				inputTextarea.reset (inputTextarea.value + ' hi');
			});
		}, 500);*/
	}
	
	ngDoCheck() {
		const width = this.rootDiv.nativeElement.offsetWidth;
		if (width !== this.previousWidth) {
			//https://v7.material.angular.io/cdk/text-field/api#CdkTextareaAutosize
			this.inputTextareas?.forEach (element => element.resizeToFitContent(true));
		}
		this.previousWidth = width;
	}

}
