import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-boolean-widget',
	templateUrl: './boolean-widget.component.html',
	styleUrls: ['./boolean-widget.component.scss', '../../entities.component.scss']
})
export class BooleanWidgetComponent extends AbstractWidget implements OnInit {

	constructor() {
		super();
	}

	ngOnInit() {
	}

}
