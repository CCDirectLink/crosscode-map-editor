import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({ selector: '[appModal]' })
export class ModalDirective {
	viewContainerRef = inject(ViewContainerRef);
}
