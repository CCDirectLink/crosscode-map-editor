import {
	AfterContentInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	Input,
	OnChanges,
	inject,
} from '@angular/core';

/**
 * requires variable "true" to be used, directive without property does nothing
 * correct: <input [appAutofocus]="true">
 * wrong:   <input appAutofocus>
 */
@Directive({
	selector: '[appAutofocus]',
	standalone: true,
})
export class AutofocusDirective implements AfterContentInit {
	private el = inject(ElementRef);
	private ref = inject(ChangeDetectorRef);

	@Input() appAutofocus = true;

	ngAfterContentInit(): void {
		if (this.appAutofocus) {
			this.el.nativeElement.focus();
			this.ref.markForCheck();
		}
	}
}
