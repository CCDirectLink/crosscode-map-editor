import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({ selector: '[appHost]' })
export class HostDirective {
	viewContainerRef = inject(ViewContainerRef);
	
}
