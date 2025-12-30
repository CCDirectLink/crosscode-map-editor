import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
	selector: '[appHost]',
	standalone: false
})
export class HostDirective {
	viewContainerRef = inject(ViewContainerRef);
	
}
