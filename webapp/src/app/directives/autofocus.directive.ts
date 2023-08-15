import { AfterContentInit, ChangeDetectorRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * requires variable "true" to be used, directive without property does nothing
 * correct: <input [appAutofocus]="true">
 * wrong:   <input appAutofocus>
 */
@Directive({
	selector: '[appAutofocus]',
	standalone: true
})
export class AutofocusDirective implements AfterContentInit {
	
	@Input() appAutofocus = true;
	
	constructor(
		private el: ElementRef,
		private ref: ChangeDetectorRef,
	) {
	}
	
	ngAfterContentInit(): void {
		if (this.appAutofocus) {
			this.el.nativeElement.focus();
			this.ref.markForCheck();
		}
	}
	
}
