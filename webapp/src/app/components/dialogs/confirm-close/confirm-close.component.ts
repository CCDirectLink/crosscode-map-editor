import { Component, isDevMode, inject } from '@angular/core';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { OverlayPanelComponent } from '../overlay/overlay-panel/overlay-panel.component';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-close',
    templateUrl: './confirm-close.component.html',
    styleUrls: ['./confirm-close.component.scss'],
    imports: [OverlayPanelComponent, CdkTrapFocus, MatButton]
})
export class ConfirmCloseComponent {
	private readonly ref = inject<OverlayRefControl<boolean | null>>(OverlayRefControl);

	protected readonly devMode = isDevMode();
	public showDevMode = false;
	
	protected close(result: boolean | null) {
		this.ref.close(result);
	}
}
