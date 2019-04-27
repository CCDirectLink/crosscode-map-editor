import { Component, OnInit } from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html',
  styleUrls: ['./person-widget.component.scss', '../widget.scss']
})
export class PersonWidgetComponent extends AbstractWidget implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    
  }

}
