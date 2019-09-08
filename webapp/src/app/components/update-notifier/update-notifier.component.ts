import { Component, OnInit } from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MatDialog} from '@angular/material/dialog';
import {UpdateNotifierDialogComponent} from './update-notifier-dialog/update-notifier-dialog.component';
@Component({
  selector: 'app-update-notifier',
  templateUrl: './update-notifier.component.html',
  styleUrls: ['./update-notifier.component.scss']
})
export class UpdateNotifierComponent implements OnInit {

  constructor(private electronService: ElectronService,
			  private events: GlobalEventsService,
			  private dialog: MatDialog) { }

  ngOnInit() {
	this.events.loadComplete.subscribe(() => this.checkForUpdate());
  }

  checkForUpdate() {
	this.electronService.checkForUpdate().then((version) => {
		if (version) {
			const updateNotif = this.dialog.open(UpdateNotifierDialogComponent, {
				data: {
					version
				}
			});

			// when the user selects update
			updateNotif.afterClosed().subscribe(result => {
				console.log(`Dialog result: ${result}`); // Pizza!
			  });
			  
			/*updateNotif.onAction().subscribe((data) => {
				this.electronService.downloadUpdate();
			});*/
		}
	});				
  }
}
