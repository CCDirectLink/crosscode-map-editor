import { Component, isDevMode, inject } from '@angular/core';
import { OverlayRefControl } from '../overlay/overlay-ref-control';

@Component({
	selector: 'app-confirm-close',
	templateUrl: './confirm-close.component.html',
	styleUrls: ['./confirm-close.component.scss'],
	standalone: false
})
export class ConfirmCloseComponent {
	private readonly ref = inject<OverlayRefControl<boolean | null>>(OverlayRefControl);

	protected readonly devMode = isDevMode();
	public showDevMode = false;
	
	protected close(result: boolean | null) {
		this.ref.close(result);
	}
}
