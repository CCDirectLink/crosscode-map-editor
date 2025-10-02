import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appHost]',
	standalone: false
})
export class HostDirective {
	
	constructor(public viewContainerRef: ViewContainerRef) {
	}
	
}
