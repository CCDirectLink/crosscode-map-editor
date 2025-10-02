import { Component, HostListener } from '@angular/core';
import { ConfirmCloseComponent } from './components/dialogs/confirm-close/confirm-close.component';
import { OverlayService } from './components/dialogs/overlay/overlay.service';
import { GlobalEventsService } from './services/global-events.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(
		private readonly eventsService: GlobalEventsService,
		private readonly overlayService: OverlayService,
	) {
	}
	
	@HostListener('window:beforeunload', ['$event'])
	onUnload($event: any) {
		if (this.eventsService.hasUnsavedChanges.getValue()) {
			$event.returnValue = 'Are you sure you want to discard your changes?';
			
			const dialogRef = this.overlayService.open(ConfirmCloseComponent, {
				hasBackdrop: true,
			});
			dialogRef.instance.showDevMode = true;
			dialogRef.ref.onClose.subscribe(result => {
				if (result) {
					this.eventsService.hasUnsavedChanges.next(false);
					window.close();
				} else if (result === null) {
					this.eventsService.hasUnsavedChanges.next(false);
					location.reload();
				}
			});
		}
	}
}
