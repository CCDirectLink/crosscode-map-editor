import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-notifier-dialog',
  templateUrl: './update-notifier-dialog.component.html',
  styleUrls: ['./update-notifier-dialog.component.scss']
})
export class UpdateNotifierDialogComponent implements OnInit {

  constructor(public snackBarRef: MatDialogRef<UpdateNotifierDialogComponent>,
    		  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
	
  }

}
