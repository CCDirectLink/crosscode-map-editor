import { Component, HostListener, inject } from '@angular/core';
import { ConfirmCloseComponent } from './components/dialogs/confirm-close/confirm-close.component';
import { OverlayService } from './components/dialogs/overlay/overlay.service';
import { GlobalEventsService } from './services/global-events.service';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [RouterOutlet]
})
export class AppComponent {
	private readonly eventsService = inject(GlobalEventsService);
	private readonly overlayService = inject(OverlayService);
	
	
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
