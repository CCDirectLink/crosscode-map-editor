import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-update-notifier-snackbar',
  templateUrl: './update-notifier-snackbar.component.html',
  styleUrls: ['./update-notifier-snackbar.component.scss']
})
export class UpdateNotifierSnackbarComponent implements OnInit {

  constructor(public snackBarRef: MatSnackBarRef<UpdateNotifierSnackbarComponent>,
    		  @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
