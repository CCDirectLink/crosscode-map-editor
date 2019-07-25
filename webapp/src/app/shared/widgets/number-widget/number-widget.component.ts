import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-number-widget',
	templateUrl: './number-widget.component.html',
	styleUrls: ['./number-widget.component.scss', '../widget.scss']
})
export class NumberWidgetComponent extends AbstractWidget implements OnInit {
	isFloat = false;

	constructor() {
		super();
	}
	
	ngOnInit() {
		super.ngOnInit();
		const attr = this.attribute;
		this.isFloat = attr && attr.float;

	}
}
