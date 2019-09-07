import { Component, OnInit } from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UpdateNotifierSnackbarComponent} from './update-notifier-snackbar/update-notifier-snackbar.component';
@Component({
  selector: 'app-update-notifier',
  templateUrl: './update-notifier.component.html',
  styleUrls: ['./update-notifier.component.scss']
})
export class UpdateNotifierComponent implements OnInit {

  constructor(private electronService: ElectronService,
			  private events: GlobalEventsService,
			  private snackBar: MatSnackBar) { }

  ngOnInit() {
	this.events.loadComplete.subscribe(() => this.checkForUpdate());
  }

  checkForUpdate() {
	this.electronService.checkForUpdate().then((version) => {
		if (version) {
			const updateNotif = this.snackBar.openFromComponent(UpdateNotifierSnackbarComponent, {
				data: {
					version
				}
			});

			// when the user selects update
			updateNotif.onAction().subscribe((data) => {
				this.electronService.downloadUpdate();
			});
		}
	});				
  }
}
