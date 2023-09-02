import { Component, Inject, isDevMode } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-close',
	templateUrl: './confirm-close.component.html',
	styleUrls: ['./confirm-close.component.scss'],
})
export class ConfirmCloseComponent  { 
	protected readonly devMode = isDevMode();
	constructor(
		@Inject(MAT_DIALOG_DATA) protected readonly data: { showDevMode?: boolean },
	) { }
}
