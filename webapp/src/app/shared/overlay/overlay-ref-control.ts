import {OverlayRef} from '@angular/cdk/overlay';

export class OverlayRefControl {
	constructor(private ref: OverlayRef) {
	
	}
	
	close() {
		this.ref.dispose();
	}
	
	isOpen() {
		return this.ref.hasAttached();
	}
}
