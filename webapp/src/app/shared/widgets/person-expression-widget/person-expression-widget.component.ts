import { Component, OnInit } from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
@Component({
  	selector: 'app-person-widget',
  	templateUrl: './person-expression-widget.component.html',
  	styleUrls: ['./person-expression-widget.component.scss', '../widget.scss']
})
export class PersonExpressionWidgetComponent extends AbstractWidget implements OnInit {

  	constructor() { 
    	super();
  	}

  	ngOnInit() {
		super.ngOnInit();
  	}
}
