import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Globals} from '../../../shared/globals';
@Component({
  selector: 'app-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss']
})
export class EditorSettingsComponent implements OnInit {
  lang;
  constructor(public ref: MatDialogRef<EditorSettingsComponent>) { }

  ngOnInit() {
    this.lang = Globals.lang;
  }
  closeDialogue() {
    this.ref.close();
  }
  update() {
    Globals.lang = this.lang;
    this.closeDialogue();
  }

}
