import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
	selector: '[appModal]',
	standalone: false
})
export class ModalDirective {
	viewContainerRef = inject(ViewContainerRef);
}
