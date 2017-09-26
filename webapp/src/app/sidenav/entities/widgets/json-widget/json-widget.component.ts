import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-json-widget',
	templateUrl: './json-widget.component.html',
	styleUrls: ['./json-widget.component.scss', '../../entities.component.scss']
})
export class JsonWidgetComponent extends AbstractWidget implements OnInit {

	json = JSON;

	constructor() {
		super();
	}

	ngOnInit() {
	}

}
