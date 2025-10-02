import { Component, isDevMode } from '@angular/core';
import { OverlayRefControl } from '../overlay/overlay-ref-control';

@Component({
	selector: 'app-confirm-close',
	templateUrl: './confirm-close.component.html',
	styleUrls: ['./confirm-close.component.scss'],
	standalone: false
})
export class ConfirmCloseComponent {
	protected readonly devMode = isDevMode();
	public showDevMode = false;
	
	constructor(
		private readonly ref: OverlayRefControl<boolean | null>,
	) {
	}
	
	protected close(result: boolean | null) {
		this.ref.close(result);
	}
}
