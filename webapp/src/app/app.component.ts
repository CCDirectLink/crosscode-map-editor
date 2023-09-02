import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmCloseComponent } from './components/dialogs/confirm-close/confirm-close.component';
import { GlobalEventsService } from './services/global-events.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(
		private readonly eventsService: GlobalEventsService,
		private readonly dialogService: MatDialog,
		private readonly router: Router
	) { 
		this.router.events.subscribe(event => {
			console.log(event.constructor.name, event);
		});
	}

	@HostListener('window:beforeunload', ['$event'])
	onUnload($event: any) {
		if(this.eventsService.hasUnsavedChanges.getValue()) {
			$event.returnValue = 'Are you sure you want to discard your changes?';
			
			const dialogRef = this.dialogService.open(ConfirmCloseComponent, {data: {showDevMode: true}});
			dialogRef.afterClosed().subscribe(result => {
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
