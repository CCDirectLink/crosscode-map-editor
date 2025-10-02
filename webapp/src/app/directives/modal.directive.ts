import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appModal]',
	standalone: false
})
export class ModalDirective {
	constructor(public viewContainerRef: ViewContainerRef) {
	}
}
