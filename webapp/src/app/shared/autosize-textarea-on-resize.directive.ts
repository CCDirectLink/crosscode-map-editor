import {Directive, ViewChild, ElementRef, ChangeDetectorRef, OnInit, DoCheck} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';


@Directive({
	selector: '[appAutosizeTextareaOnResize]'
})
export class AutosizeTextareaOnResizeDirective implements OnInit, DoCheck {
	//@ViewChild(CdkTextareaAutosize, {static: true}) autoSize?: CdkTextareaAutosize;
	private previousWidth = 0;
	
	constructor(
		private readonly element: ElementRef,
		private readonly changeDetector: ChangeDetectorRef,
		private readonly autoSize?: CdkTextareaAutosize,
	) {
	}
	
	ngOnInit() {
		if (this.autoSize === undefined) {
			console.error('matTextareaAutosize directive is required to use ' + AutosizeTextareaOnResizeDirective.name + '.');
		}
		//Workaround for height not properly adjusting when opening detail panel
		//This seems to happen because the widget is created with minimum width and
		//and its height is determined then, but when expanded its height does not get adjusted.
		//So as a workaround 500ms from when the panel is opened we force a size update of the widget.
		setInterval (() => {
			//this.changeDetector.detectChanges ();
			this.updateSize();
		}, 100);
	}
	
	ngDoCheck() {
		this.updateSize();
	}
	
	private updateSize() {
		const width = this.element.nativeElement.offsetWidth;
		if (width !== this.previousWidth && this.autoSize) {
			//https://v7.material.angular.io/cdk/text-field/api#CdkTextareaAutosize
			this.autoSize.resizeToFitContent(true);
		}
		this.previousWidth = width;
	}
}
