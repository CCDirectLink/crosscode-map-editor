import { Component, isDevMode } from '@angular/core';

@Component({
	selector: 'app-confirm-close',
	templateUrl: './confirm-close.component.html',
	styleUrls: ['./confirm-close.component.scss'],
})
export class ConfirmCloseComponent  { 
	protected readonly devMode = isDevMode();
}
