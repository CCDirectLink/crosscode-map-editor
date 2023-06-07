import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class OverlayRefControl {
	
	onClose = new Subject<void>();
	
	constructor(private ref: OverlayRef) {
	}
	
	close() {
		this.ref.dispose();
		this.onClose.next();
	}
	
	isOpen() {
		return this.ref.hasAttached();
	}
}
