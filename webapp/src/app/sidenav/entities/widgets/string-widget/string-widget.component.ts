import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-string-widget',
	templateUrl: './string-widget.component.html',
	styleUrls: ['./string-widget.component.scss', '../../entities.component.scss']
})
export class StringWidgetComponent extends AbstractWidget implements OnInit {

	constructor() {
		super();
	}

	ngOnInit() {
	}

}
