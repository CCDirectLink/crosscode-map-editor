import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-number-widget',
	templateUrl: './number-widget.component.html',
	styleUrls: ['./number-widget.component.scss', '../widget.scss']
})
export class NumberWidgetComponent extends AbstractWidget implements OnInit {

	constructor() {
		super();
	}

	ngOnInit() {
	}

}
