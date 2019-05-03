import {Component} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-person-expression-widget',
  	templateUrl: './person-expression-widget.component.html',
  	styleUrls: ['./person-expression-widget.component.scss', '../widget.scss']
})
export class PersonExpressionWidgetComponent extends AbstractWidget {

  	constructor() { 
		super();
  	}
}
