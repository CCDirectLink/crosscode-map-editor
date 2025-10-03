import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class OverlayRefControl<T = void> {
	onClose = new Subject<T | undefined>();

	constructor(private ref: OverlayRef) {}

	close(result?: T) {
		this.ref.dispose();
		this.onClose.next(result);
		this.onClose.complete();
	}

	isOpen() {
		return this.ref.hasAttached();
	}
}
